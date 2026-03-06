import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar, CheckCircle2, XCircle, Clock,
    User, MessageSquare, IndianRupee, Loader2,
    Plus, Trash2, Upload, MapPin, Award, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { format, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ArtistDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [experience, setExperience] = useState("");
    const [price, setPrice] = useState(0);
    const [story, setStory] = useState("");
    const [packages, setPackages] = useState<any[]>([]);
    const [gallery, setGallery] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<FileList | null>(null);
    const [galleryToDelete, setGalleryToDelete] = useState<string[]>([]);

    useEffect(() => {
        if (user && user.role !== 'artist') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([fetchBookings(), fetchProfile()]);
        setIsLoading(false);
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/artists/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setProfile(data);

            // Sync form states
            setName(data.name || "");
            setBio(data.bio || "");
            setSpecialty(data.specialty || "");
            setExperience(data.experience || "");
            setPrice(data.price || 0);
            setStory(data.story || "");
            setPackages(data.pricing?.packages || []);
            setGallery(data.gallery || []);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/bookings/artist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (bookingId: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast.success(`Booking ${status} successfully`);
                fetchBookings();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('bio', bio);
            formData.append('specialty', specialty);
            formData.append('experience', experience);
            formData.append('price', price.toString());
            formData.append('story', story);
            formData.append('pricing', JSON.stringify({ packages, addOns: profile?.pricing?.addOns || [] }));
            formData.append('galleryToDelete', JSON.stringify(galleryToDelete));

            if (newImages) {
                Array.from(newImages).forEach(file => {
                    formData.append('images', file);
                });
            }

            const response = await fetch('/api/artists/profile', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                toast.success("Profile updated successfully");
                fetchProfile();
                setNewImages(null);
                setGalleryToDelete([]);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const addPackage = () => {
        setPackages([...packages, { name: "", duration: "", description: "", price: 0 }]);
    };

    const removePackage = (index: number) => {
        setPackages(packages.filter((_, i) => i !== index));
    };

    const updatePackage = (index: number, field: string, value: any) => {
        const newPackages = [...packages];
        newPackages[index] = { ...newPackages[index], [field]: value };
        setPackages(newPackages);
    };

    const toggleDeleteImage = (id: string) => {
        if (galleryToDelete.includes(id)) {
            setGalleryToDelete(galleryToDelete.filter(i => i !== id));
        } else {
            setGalleryToDelete([...galleryToDelete, id]);
        }
    };

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-8">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold">Artist Dashboard</h1>
                        <p className="text-muted-foreground">Manage your bookings and schedule</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`h-3 w-3 rounded-full ${user?.available ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium">{user?.available ? 'Accepting Bookings' : 'Not Available'}</span>
                    </div>
                </header>

                <Tabs defaultValue="pending">
                    <TabsList className="mb-8">
                        <TabsTrigger value="pending" className="relative">
                            Bookings
                            {pendingBookings.length > 0 && (
                                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {pendingBookings.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                        <div className="grid gap-6">
                            {pendingBookings.length === 0 ? (
                                <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                                    <Clock className="mb-2 h-8 w-8" />
                                    <p>No pending booking requests</p>
                                </div>
                            ) : (
                                pendingBookings.map(booking => (
                                    <BookingCard key={booking._id} booking={booking} onAction={updateStatus} />
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="schedule">
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Events</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {confirmedBookings.length === 0 ? (
                                        <div className="py-8 text-center text-muted-foreground">
                                            No confirmed events scheduled.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {confirmedBookings.map(booking => (
                                                <div key={booking._id} className="flex items-center justify-between rounded-lg border p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
                                                            <span className="text-xs font-bold uppercase">{format(new Date(booking.date), "MMM")}</span>
                                                            <span className="text-xl font-bold">{format(new Date(booking.date), "dd")}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">{booking.customer.name}</h4>
                                                            <p className="text-sm text-muted-foreground">{format(new Date(booking.date), "EEEE, h:mm a")}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline">Confirmed</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile">
                        <form onSubmit={handleUpdateProfile} className="grid gap-8 pb-12">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Professional Details</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Artist Stage Name</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="specialty">Primary Specialty</Label>
                                            <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Kathakali, Baul Singing" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="experience">Experience</Label>
                                            <Input id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 15+ Years" />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="story">The Story of Your Art</Label>
                                        <Textarea id="story" value={story} onChange={(e) => setStory(e.target.value)} rows={3} placeholder="Share the heritage and tradition behind your performances..." />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Gallery */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Gallery</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                                        {gallery.map((item) => (
                                            <div key={item._id} className="group relative aspect-square overflow-hidden rounded-lg border">
                                                <img src={item.url} className="h-full w-full object-cover" />
                                                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 ${galleryToDelete.includes(item._id) ? "opacity-100 bg-red-500/40" : ""}`}>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-white"
                                                        onClick={() => toggleDeleteImage(item._id)}
                                                    >
                                                        {galleryToDelete.includes(item._id) ? <Plus className="rotate-45" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50">
                                            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground text-center">Upload Images</span>
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setNewImages(e.target.files)} />
                                        </label>
                                    </div>
                                    {newImages && (
                                        <p className="text-sm text-primary">{newImages.length} new images selected</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Pricing */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle>Pricing Packages</CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={addPackage}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Package
                                    </Button>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    {packages.map((pkg, index) => (
                                        <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-4">
                                            <div className="grid gap-2">
                                                <Label>Package Name</Label>
                                                <Input value={pkg.name} onChange={(e) => updatePackage(index, 'name', e.target.value)} placeholder="Basic / Full Show" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Duration</Label>
                                                <Input value={pkg.duration} onChange={(e) => updatePackage(index, 'duration', e.target.value)} placeholder="2 Hours" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Price (₹)</Label>
                                                <Input type="number" value={pkg.price} onChange={(e) => updatePackage(index, 'price', Number(e.target.value))} />
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div className="grid gap-2 flex-1">
                                                    <Label>Description</Label>
                                                    <Input value={pkg.description} onChange={(e) => updatePackage(index, 'description', e.target.value)} />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removePackage(index)} className="text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="flex sticky bottom-8 justify-end">
                                <Button type="submit" size="lg" disabled={isSaving} className="bg-gradient-saffron shadow-lg">
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Profile Changes
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="grid gap-6">
                            {pastBookings.length === 0 ? (
                                <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                                    <CheckCircle2 className="mb-2 h-8 w-8" />
                                    <p>No booking history</p>
                                </div>
                            ) : (
                                pastBookings.map(booking => (
                                    <BookingCard key={booking._id} booking={booking} onAction={updateStatus} />
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

const BookingCard = ({ booking, onAction }: { booking: any, onAction: (id: string, status: string) => void }) => {
    return (
        <Card className="overflow-hidden">
            <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                        <img src={booking.customer.profileImage} className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <h4 className="font-semibold">{booking.customer.name}</h4>
                            <Badge variant={
                                booking.status === 'confirmed' ? 'default' :
                                    booking.status === 'pending' ? 'outline' :
                                        'secondary'
                            }>
                                {booking.status}
                            </Badge>
                        </div>
                        <div className="grid gap-x-4 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(booking.date), "PPP")}
                            </div>
                            <div className="flex items-center gap-1">
                                <IndianRupee className="h-3.5 w-3.5" />
                                ₹{booking.price.toLocaleString("en-IN")}
                            </div>
                        </div>
                        {booking.message && (
                            <div className="mt-2 flex items-start gap-1 text-sm italic">
                                <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                "{booking.message}"
                            </div>
                        )}
                    </div>
                </div>

                {booking.status === 'pending' && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => onAction(booking._id, 'cancelled')}
                        >
                            <XCircle className="mr-1.5 h-4 w-4" />
                            Reject
                        </Button>
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onAction(booking._id, 'confirmed')}
                        >
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            Confirm
                        </Button>
                    </div>
                )}

                {booking.status === 'confirmed' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAction(booking._id, 'completed')}
                    >
                        Mark Completed
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default ArtistDashboard;
