import React from "react";

function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

        {/* Security */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Security
          </h2>
          <div className="divide-y">
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Change password</span>
              <button className="text-blue-600 text-sm hover:underline">
                Manage
              </button>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Two-factor authentication</span>
              <button className="text-blue-600 text-sm hover:underline">
                Enable
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Preferences
          </h2>
          <div className="divide-y">
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Language</span>
              <select
                className="border rounded-md px-2 py-1 text-sm bg-white"
              >
                <option>English</option>
                <option>Urdu</option>
                <option>Arabic</option>
              </select>
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Account Management
          </h2>
          <div className="divide-y">
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Deactivate account</span>
              <button className="text-red-600 text-sm hover:underline">
                Deactivate
              </button>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Delete account</span>
              <button className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
