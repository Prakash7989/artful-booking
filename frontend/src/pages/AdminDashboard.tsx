import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Artist {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    bio?: string;
    state?: string;
    specialty?: string;
    awards?: string;
    isApproved: boolean;
    createdAt: string;
}

interface UserRecord {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'artist' | 'admin';
    profileImage: string;
    isApproved?: boolean;
    createdAt: string;
}

type ActiveTab = 'pending' | 'artists' | 'users';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<ActiveTab>('pending');
    const [artists, setArtists] = useState<Artist[]>([]);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [isLoadingArtists, setIsLoadingArtists] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const token = user?.token || localStorage.getItem('token');

    const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const fetchArtists = useCallback(async () => {
        setIsLoadingArtists(true);
        try {
            const res = await fetch('/api/admin/artists', { headers: authHeaders });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setArtists(data);
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setIsLoadingArtists(false);
        }
    }, [token]);

    const fetchUsers = useCallback(async () => {
        setIsLoadingUsers(true);
        try {
            const res = await fetch('/api/admin/users', { headers: authHeaders });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(data);
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setIsLoadingUsers(false);
        }
    }, [token]);

    useEffect(() => {
        fetchArtists();
    }, [fetchArtists]);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
    }, [activeTab, fetchUsers]);

    const approveArtist = async (id: string) => {
        setActionLoading(id + '-approve');
        try {
            const res = await fetch(`/api/admin/artists/${id}/approve`, { method: 'PATCH', headers: authHeaders });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setArtists((prev) => prev.map((a) => (a._id === id ? { ...a, isApproved: true } : a)));
            toast({ title: '✅ Artist Approved', description: 'Artist can now log in and be listed.' });
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setActionLoading(null);
        }
    };

    const rejectArtist = async (id: string) => {
        setActionLoading(id + '-reject');
        try {
            const res = await fetch(`/api/admin/artists/${id}/reject`, { method: 'PATCH', headers: authHeaders });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setArtists((prev) => prev.map((a) => (a._id === id ? { ...a, isApproved: false } : a)));
            toast({ title: '❌ Artist Rejected', description: 'Artist access has been revoked.' });
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setActionLoading(null);
        }
    };

    const deleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setActionLoading(id + '-delete');
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setArtists((prev) => prev.filter((a) => a._id !== id));
            toast({ title: 'User Deleted', description: 'User has been removed.' });
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const pendingArtists = artists.filter((a) => !a.isApproved);

    const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
        {
            id: 'pending',
            label: 'Pending Approval',
            count: pendingArtists.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            id: 'artists',
            label: 'All Artists',
            count: artists.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            id: 'users',
            label: 'All Users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-16'
                    } transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-sm leading-none">Artful</p>
                            <p className="text-violet-400 text-xs tracking-widest uppercase">Admin</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
                        title="Toggle sidebar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'} />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {sidebarOpen && (
                                <>
                                    <span className="truncate">{item.label}</span>
                                    {item.count !== undefined && (
                                        <span
                                            className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.id === 'pending' && item.count > 0
                                                    ? 'bg-amber-500/20 text-amber-300'
                                                    : 'bg-gray-700 text-gray-400'
                                                }`}
                                        >
                                            {item.count}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="p-3 border-t border-gray-800">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
                            <img
                                src={user?.profileImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                                alt={user?.name}
                                className="w-7 h-7 rounded-full object-cover border border-gray-600"
                            />
                            <div className="overflow-hidden">
                                <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {sidebarOpen && 'Sign Out'}
                    </button>
                    {sidebarOpen && (
                        <Link
                            to="/"
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-colors"
                        >
                            ← Main site
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Top Bar */}
                <header className="bg-gray-900/60 border-b border-gray-800 backdrop-blur px-6 py-4 flex items-center gap-4">
                    <div>
                        <h1 className="text-white font-bold text-xl">
                            {activeTab === 'pending' && 'Pending Approvals'}
                            {activeTab === 'artists' && 'All Artists'}
                            {activeTab === 'users' && 'All Users'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {activeTab === 'pending' && `${pendingArtists.length} artist(s) awaiting review`}
                            {activeTab === 'artists' && `${artists.length} total artists registered`}
                            {activeTab === 'users' && `${users.length} total users`}
                        </p>
                    </div>
                    <button
                        onClick={() => { fetchArtists(); if (activeTab === 'users') fetchUsers(); }}
                        className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </header>

                <div className="p-6">

                    {/* ── PENDING ARTISTS ── */}
                    {activeTab === 'pending' && (
                        <div>
                            {isLoadingArtists ? (
                                <LoadingSpinner />
                            ) : pendingArtists.length === 0 ? (
                                <EmptyState icon="✅" title="All caught up!" desc="No artists are pending approval right now." />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {pendingArtists.map((artist) => (
                                        <ArtistCard
                                            key={artist._id}
                                            artist={artist}
                                            actionLoading={actionLoading}
                                            onApprove={approveArtist}
                                            onReject={rejectArtist}
                                            onDelete={deleteUser}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ALL ARTISTS ── */}
                    {activeTab === 'artists' && (
                        <div>
                            {isLoadingArtists ? (
                                <LoadingSpinner />
                            ) : artists.length === 0 ? (
                                <EmptyState icon="🎨" title="No artists yet" desc="Artists who register will appear here." />
                            ) : (
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-800">
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Artist</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Specialty</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">State</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Joined</th>
                                                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {artists.map((artist) => (
                                                <tr key={artist._id} className="hover:bg-gray-800/40 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={artist.profileImage}
                                                                alt={artist.name}
                                                                className="w-9 h-9 rounded-full object-cover border border-gray-700"
                                                            />
                                                            <div>
                                                                <p className="text-white text-sm font-medium">{artist.name}</p>
                                                                <p className="text-gray-500 text-xs">{artist.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-300 text-sm">{artist.specialty || '—'}</td>
                                                    <td className="px-5 py-3 text-gray-300 text-sm">{artist.state || '—'}</td>
                                                    <td className="px-5 py-3">
                                                        <StatusBadge approved={artist.isApproved} />
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(artist.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {!artist.isApproved ? (
                                                                <ActionButton
                                                                    onClick={() => approveArtist(artist._id)}
                                                                    loading={actionLoading === artist._id + '-approve'}
                                                                    variant="approve"
                                                                    label="Approve"
                                                                />
                                                            ) : (
                                                                <ActionButton
                                                                    onClick={() => rejectArtist(artist._id)}
                                                                    loading={actionLoading === artist._id + '-reject'}
                                                                    variant="reject"
                                                                    label="Revoke"
                                                                />
                                                            )}
                                                            <ActionButton
                                                                onClick={() => deleteUser(artist._id)}
                                                                loading={actionLoading === artist._id + '-delete'}
                                                                variant="delete"
                                                                label="Delete"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ALL USERS ── */}
                    {activeTab === 'users' && (
                        <div>
                            {isLoadingUsers ? (
                                <LoadingSpinner />
                            ) : users.length === 0 ? (
                                <EmptyState icon="👥" title="No users yet" desc="Registered users will appear here." />
                            ) : (
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-800">
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">User</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Role</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Joined</th>
                                                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {users.map((u) => (
                                                <tr key={u._id} className="hover:bg-gray-800/40 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={u.profileImage}
                                                                alt={u.name}
                                                                className="w-9 h-9 rounded-full object-cover border border-gray-700"
                                                            />
                                                            <div>
                                                                <p className="text-white text-sm font-medium">{u.name}</p>
                                                                <p className="text-gray-500 text-xs">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <RoleBadge role={u.role} />
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {u.role === 'artist' ? <StatusBadge approved={!!u.isApproved} /> : <span className="text-gray-500 text-xs">—</span>}
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-5 py-3 text-right">
                                                        {u.role !== 'admin' && (
                                                            <ActionButton
                                                                onClick={() => deleteUser(u._id)}
                                                                loading={actionLoading === u._id + '-delete'}
                                                                variant="delete"
                                                                label="Delete"
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

/* ── Sub-components ── */

function ArtistCard({
    artist,
    actionLoading,
    onApprove,
    onReject,
    onDelete,
}: {
    artist: Artist;
    actionLoading: string | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-200">
            {/* Card top accent */}
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={artist.profileImage}
                        alt={artist.name}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-gray-700 shadow-lg"
                    />
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold text-base truncate">{artist.name}</p>
                        <p className="text-gray-500 text-xs truncate">{artist.email}</p>
                        <span className="inline-block mt-1 text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                            ⏳ Pending
                        </span>
                    </div>
                </div>

                <div className="space-y-1.5 mb-5">
                    {artist.specialty && (
                        <Info label="Specialty" value={artist.specialty} />
                    )}
                    {artist.state && (
                        <Info label="State" value={artist.state} />
                    )}
                    {artist.bio && (
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{artist.bio}</p>
                    )}
                    {artist.awards && (
                        <Info label="Awards" value={artist.awards} />
                    )}
                </div>

                <div className="text-xs text-gray-600 mb-4">
                    Registered: {new Date(artist.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <div className="flex gap-2">
                    <ActionButton
                        onClick={() => onApprove(artist._id)}
                        loading={actionLoading === artist._id + '-approve'}
                        variant="approve"
                        label="Approve"
                        fullWidth
                    />
                    <ActionButton
                        onClick={() => onReject(artist._id)}
                        loading={actionLoading === artist._id + '-reject'}
                        variant="reject"
                        label="Reject"
                        fullWidth
                    />
                    <ActionButton
                        onClick={() => onDelete(artist._id)}
                        loading={actionLoading === artist._id + '-delete'}
                        variant="delete"
                        label=""
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs w-16 flex-shrink-0">{label}:</span>
            <span className="text-gray-300 text-xs truncate">{value}</span>
        </div>
    );
}

function StatusBadge({ approved }: { approved: boolean }) {
    return approved ? (
        <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Approved
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending
        </span>
    );
}

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
        artist: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        customer: 'bg-gray-700/50 text-gray-400 border-gray-600/40',
    };
    return (
        <span className={`inline-block text-xs border px-2.5 py-1 rounded-full font-medium capitalize ${styles[role] || styles.customer}`}>
            {role}
        </span>
    );
}

function ActionButton({
    onClick,
    loading,
    variant,
    label,
    fullWidth,
    icon,
}: {
    onClick: () => void;
    loading: boolean;
    variant: 'approve' | 'reject' | 'delete';
    label: string;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}) {
    const styles = {
        approve: 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60',
        reject: 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/30 hover:border-amber-500/60',
        delete: 'bg-red-600/15 hover:bg-red-600/30 text-red-400 border border-red-500/20 hover:border-red-500/50',
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${fullWidth ? 'flex-1' : ''}`}
        >
            {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
                <>
                    {icon}
                    {label}
                </>
            )}
        </button>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
    );
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">{icon}</span>
            <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
        </div>
    );
}
