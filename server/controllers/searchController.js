import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Post from '../models/Post.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { query, type, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = { $regex: query, $options: 'i' };
    let results = {};
    const searchLimit = parseInt(limit);
    const skip = (parseInt(page) - 1) * searchLimit;

    switch (type) {
      case 'users':
        results.users = await User.find({
          $or: [
            { name: searchRegex },
            { bio: searchRegex },
            { skills: { $in: [new RegExp(query, 'i')] } }
          ]
        })
        .select('name avatar bio skills location')
        .limit(searchLimit)
        .skip(skip);
        break;

      case 'companies':
        results.companies = await Company.find({
          $or: [
            { name: searchRegex },
            { bio: searchRegex },
            { industry: searchRegex }
          ]
        })
        .select('name avatar bio industry location website')
        .limit(searchLimit)
        .skip(skip);
        break;

      case 'jobs':
        results.jobs = await Job.find({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { requirements: { $in: [new RegExp(query, 'i')] } }
          ],
          status: 'active',
          expiresAt: { $gt: new Date() }
        })
        .populate('company', 'name avatar industry')
        .limit(searchLimit)
        .skip(skip);
        break;

      case 'posts':
        results.posts = await Post.find({
          content: searchRegex,
          isPublic: true
        })
        .populate('author', 'name avatar')
        .limit(searchLimit)
        .skip(skip);
        break;

      default:
        // Search across all types
        const [users, companies, jobs, posts] = await Promise.all([
          User.find({
            $or: [
              { name: searchRegex },
              { bio: searchRegex },
              { skills: { $in: [new RegExp(query, 'i')] } }
            ]
          })
          .select('name avatar bio skills location')
          .limit(5)
          .skip(0),

          Company.find({
            $or: [
              { name: searchRegex },
              { bio: searchRegex },
              { industry: searchRegex }
            ]
          })
          .select('name avatar bio industry location website')
          .limit(5)
          .skip(0),

          Job.find({
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { requirements: { $in: [new RegExp(query, 'i')] } }
            ],
            status: 'active',
            expiresAt: { $gt: new Date() }
          })
          .populate('company', 'name avatar industry')
          .limit(5)
          .skip(0),

          Post.find({
            content: searchRegex,
            isPublic: true
          })
          .populate('author', 'name avatar')
          .limit(5)
          .skip(0)
        ]);

        results = { users, companies, jobs, posts };
        break;
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

export const advancedJobSearch = async (req, res, next) => {
  try {
    const { 
      query, 
      location, 
      employmentType, 
      category, 
      minSalary, 
      maxSalary, 
      experience,
      page = 1, 
      limit = 10 
    } = req.query;

    let filter = { status: 'active', expiresAt: { $gt: new Date() } };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { requirements: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (employmentType) {
      filter.employmentType = employmentType;
    }

    if (category) {
      filter.category = category;
    }

    if (minSalary || maxSalary) {
      filter.$and = [];
      if (minSalary) {
        filter.$and.push({ 'salaryRange.min': { $gte: parseInt(minSalary) } });
      }
      if (maxSalary) {
        filter.$and.push({ 'salaryRange.max': { $lte: parseInt(maxSalary) } });
      }
    }

    if (experience) {
      filter.experienceLevel = experience;
    }

    const jobs = await Job.find(filter)
      .populate('company', 'name avatar industry location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};