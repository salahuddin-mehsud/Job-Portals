import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

export const notificationHandlers = (socket, io) => {
  
  // Handle user subscribing to notifications
  socket.on('subscribe_notifications', async (userId) => {
    try {
      socket.userId = userId;
      
      // Determine user model based on role or query
      let user = await User.findById(userId);
      if (user) {
        socket.userModel = 'User';
        socket.userName = user.name;
      } else {
        user = await Company.findById(userId);
        if (user) {
          socket.userModel = 'Company';
          socket.userName = user.name;
        } else {
          socket.emit('error', 'User not found');
          return;
        }
      }

      socket.join(userId);
      console.log(`User ${userId} subscribed to notifications`);

      // Send unread count on subscription
      const unreadCount = await Notification.countDocuments({
        recipient: userId,
        recipientModel: socket.userModel,
        isRead: false
      });

      socket.emit('unread_count', unreadCount);

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle marking notification as read
  socket.on('mark_notification_read', async (notificationId) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: notificationId, 
          recipient: socket.userId,
          recipientModel: socket.userModel 
        },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (notification) {
        socket.emit('notification_marked_read', notification);
        
        // Update unread count
        const unreadCount = await Notification.countDocuments({
          recipient: socket.userId,
          recipientModel: socket.userModel,
          isRead: false
        });

        socket.emit('unread_count', unreadCount);
      }

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle marking all notifications as read
  socket.on('mark_all_notifications_read', async () => {
    try {
      await Notification.updateMany(
        { 
          recipient: socket.userId,
          recipientModel: socket.userModel,
          isRead: false 
        },
        { isRead: true, readAt: new Date() }
      );

      socket.emit('all_notifications_marked_read');
      socket.emit('unread_count', 0);

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle deleting notification
  socket.on('delete_notification', async (notificationId) => {
    try {
      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: socket.userId,
        recipientModel: socket.userModel
      });

      socket.emit('notification_deleted', notificationId);

      // Update unread count
      const unreadCount = await Notification.countDocuments({
        recipient: socket.userId,
        recipientModel: socket.userModel,
        isRead: false
      });

      socket.emit('unread_count', unreadCount);

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle real-time notification preferences
  socket.on('update_notification_preferences', async (preferences) => {
    try {
      let entity;
      if (socket.userModel === 'User') {
        entity = await User.findById(socket.userId);
      } else {
        entity = await Company.findById(socket.userId);
      }

      if (entity) {
        entity.notificationPreferences = preferences;
        await entity.save();
        socket.emit('notification_preferences_updated', preferences);
      }

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Helper function to send notification (can be used by other parts of the app)
  const sendNotification = async (notificationData) => {
    try {
      const notification = new Notification(notificationData);
      await notification.save();

      // Emit to the recipient if they're online
      io.to(notificationData.recipient.toString()).emit('new_notification', notification);

      // Update unread count for the recipient
      const unreadCount = await Notification.countDocuments({
        recipient: notificationData.recipient,
        recipientModel: notificationData.recipientModel,
        isRead: false
      });

      io.to(notificationData.recipient.toString()).emit('unread_count', unreadCount);

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Export the helper function for use in controllers
  return { sendNotification };
};