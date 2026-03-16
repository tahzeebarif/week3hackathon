import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/common';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(r => setUsers(r.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleBlock = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/block`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
    } catch { toast.error('Failed to update user'); }
  };

  const handleRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <div>
      {loading ? <Spinner /> : (
        <div className="bg-white border border-[#e0ddd8]">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-[#e0ddd8] flex items-center justify-between">
            <h3 className="font-serif text-[18px] font-light text-[#1a1a1a]">All Users</h3>
            <span className="text-[11px] font-sans text-[#8a8a8a]">{users.length} total</span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f5f5f3]">
                {['User','Email','Role','Status','Joined','Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] tracking-[2px] uppercase font-sans text-[#8a8a8a] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-[#f5f5f3] hover:bg-[#fafaf9] transition-colors">

                  {/* Avatar + Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center text-[11px] font-sans font-medium flex-shrink-0">
                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="text-xs font-sans text-[#1a1a1a]">{u.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-xs font-sans text-[#4a4a4a]">{u.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {isSuperAdmin && u._id !== currentUser._id ? (
                      <select value={u.role}
                        onChange={e => handleRole(u._id, e.target.value)}
                        className="text-[10px] tracking-[1px] uppercase font-sans border border-[#e0ddd8] bg-white px-2 py-1 outline-none cursor-pointer">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] tracking-[1px] uppercase font-sans px-2 py-1 rounded-sm
                        ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-800'
                        : u.role === 'admin' ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`text-[10px] tracking-[1px] uppercase font-sans px-2 py-1 rounded-sm
                      ${u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-xs font-sans text-[#8a8a8a]">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    {isSuperAdmin && u._id !== currentUser._id ? (
                      <button onClick={() => handleBlock(u._id, u.isBlocked)}
                        className={`text-[10px] tracking-[1px] uppercase font-sans px-3 py-1.5 border cursor-pointer transition-colors
                          ${u.isBlocked
                            ? 'border-green-300 text-green-700 hover:bg-green-50'
                            : 'border-red-300 text-red-700 hover:bg-red-50'}`}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    ) : (
                      <span className="text-[10px] font-sans text-[#8a8a8a]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
