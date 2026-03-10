import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';

const statusVariant = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
};

const UserTable = ({ users, loading, error, onRefresh }) => {
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleActivate = async (userId) => {
    setActionLoading(userId + '-activate');
    setActionError('');
    try {
      await adminAPI.activateUser(userId);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionError(err.message || 'Failed to activate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (userId) => {
    setActionLoading(userId + '-deactivate');
    setActionError('');
    try {
      await adminAPI.deactivateUser(userId);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionError(err.message || 'Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setActionLoading(userId + '-delete');
    setActionError('');
    try {
      await adminAPI.deleteUser(userId);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionError(err.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRefresh} />;
  }

  return (
    <div className="space-y-3">
      {actionError && <ErrorMessage message={actionError} />}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const status = user.isActive !== false ? 'active' : 'inactive';
                const isActing = actionLoading?.startsWith(user.id);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'admin' ? 'error' : user.role === 'lawyer' ? 'primary' : 'default'}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[status]} dot>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {status === 'inactive' ? (
                          <Button
                            size="sm"
                            variant="success"
                            loading={actionLoading === user.id + '-activate'}
                            disabled={isActing}
                            onClick={() => handleActivate(user.id)}
                          >
                            Activate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="warning"
                            loading={actionLoading === user.id + '-deactivate'}
                            disabled={isActing}
                            onClick={() => handleDeactivate(user.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          loading={actionLoading === user.id + '-delete'}
                          disabled={isActing}
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
