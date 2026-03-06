import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, MapPin, Calendar, Clock, Users, Award, Play,
  ChevronLeft, ChevronRight, Heart, Share2, CheckCircle,
  Phone, Mail, Music, Palette, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import BookingModal from "@/components/BookingModal";

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/artists/${id}`);
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!artist) {
    return (
      <MainLayout>
        <div className="flex h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Artist not found</h2>
          <Link to="/artists" className="mt-4 text-primary underline">Back to Artists</Link>
        </div>
      </MainLayout>
    );
  }

  const gallery = [
    { id: 1, type: "image", url: artist.profileImage || "/placeholder.svg", title: "Profile Image" },
    // In a real app we would have more images in the gallery field
    { id: 2, type: "image", url: "/placeholder.svg", title: "Performance" },
  ];


  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/artists" className="hover:text-primary">Artists</Link>
            <span>/</span>
            <span className="text-foreground">{artist.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream via-background to-muted py-8 md:py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card">
                <img
                  src={artist?.gallery?.[currentGalleryIndex]?.url || artist?.profileImage || "/placeholder.svg"}
                  alt={artist?.gallery?.[currentGalleryIndex]?.title || "Artist Profile"}
                  className="h-full w-full object-cover"
                />
                {artist?.gallery?.[currentGalleryIndex]?.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <Button size="lg" className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary">
                      <Play className="h-8 w-8 fill-primary-foreground" />
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                {(artist?.gallery?.length || 0) > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background"
                      onClick={prevGalleryImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background"
                      onClick={nextGalleryImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Counter */}
                {(artist?.gallery?.length || 0) > 0 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm">
                    {currentGalleryIndex + 1} / {artist.gallery.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {(artist?.gallery?.length || 0) > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {artist.gallery.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGalleryIndex(index)}
                      className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${index === currentGalleryIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img src={item.url || "/placeholder.svg"} alt={item.title || "Gallery Item"} className="h-full w-full object-cover" />
                      {item.type === "video" && (
                        <Play className="absolute inset-0 m-auto h-5 w-5 text-primary-foreground drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" /> Verified
                </Badge>
                {artist.available ? (
                  <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>
                ) : (
                  <Badge variant="secondary">Currently Booked</Badge>
                )}
              </div>

              <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                {artist.name}
              </h1>
              <p className="mb-4 text-lg text-primary">{artist.artForm || artist.specialty || 'Traditional Artist'}</p>

              {/* Art Forms */}
              <div className="mb-4 flex flex-wrap gap-2">
                {(Array.isArray(artist?.artForms) ? artist.artForms : [artist?.artForm]).filter(Boolean).map((art: any) => (
                  <Badge key={art} variant="outline" className="border-primary/30 bg-primary/5">
                    <Palette className="mr-1 h-3 w-3" /> {art}
                  </Badge>
                ))}
              </div>

              {/* Rating & Location */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{artist.rating || 4.5}</span>
                  <span className="text-muted-foreground">({artist.reviewsCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {artist.city && `${artist.city}, `}{artist.state}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4">
                <div className="text-center">
                  <Clock className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">{artist.experience || 'Experienced'}</p>
                  <p className="text-xs text-muted-foreground">Experience</p>
                </div>
                <div className="text-center">
                  <Award className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">{artist.specialty || artist.artForm || 'Maestro'}</p>
                  <p className="text-xs text-muted-foreground">Specialty</p>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <p className="text-3xl font-bold text-foreground">
                      ₹{(artist.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">per performance</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-saffron text-lg hover:opacity-90"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-secondary text-secondary" : ""}`} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        artistId={artist._id}
        artistName={artist.name}
        price={artist.price || 0}
      />

      {/* Details Tabs */}
      <section className="py-8 md:py-12">
        <div className="container">
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Artist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{artist.bio || 'No bio available.'}</p>
                    {artist.story && <p className="text-muted-foreground">{artist.story}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-accent" />
                      Specialization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                          <CheckCircle className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-foreground">{artist.artForm || artist.specialty}</span>
                      </li>
                      {artist?.awards && (Array.isArray(artist.awards) ? artist.awards : [artist.awards]).map((award: any, index: number) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                            <Award className="h-4 w-4 text-accent" />
                          </div>
                          <span className="text-foreground">{award}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {(artist?.pastPerformances?.length || 0) > 0 && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Past Performances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {artist.pastPerformances.map((perf: any, index: number) => (
                          <div key={index} className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="font-semibold text-foreground">{perf.event}</p>
                            <p className="text-sm text-muted-foreground">{perf.venue}</p>
                            <p className="mt-2 text-xs text-primary">{perf.date}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Packages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {artist?.pricing?.packages?.length ? (
                      artist.pricing.packages.map((pkg: any, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg border border-border p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                            <Badge variant="outline">{pkg.duration}</Badge>
                          </div>
                          <p className="mb-3 text-sm text-muted-foreground">{pkg.description}</p>
                          <p className="text-xl font-bold text-primary">
                            ₹{pkg.price?.toLocaleString("en-IN") || 0}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Standard pricing applies based on the quoted rate.</p>
                    )}
                  </CardContent>
                </Card>

                {artist?.pricing?.addOns?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add-ons</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {artist.pricing.addOns.map((addon: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <span className="text-foreground">{addon.name}</span>
                          <span className="font-semibold text-primary">
                            +₹{addon.price?.toLocaleString("en-IN") || 0}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-secondary"></div>
                      <span className="text-sm text-muted-foreground">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-muted"></div>
                      <span className="text-sm text-muted-foreground">Blocked</span>
                    </div>
                  </div>

                  {/* Simple Calendar Grid */}
                  <div className="rounded-lg border border-border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold">March 2026</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="py-2 text-xs font-medium text-muted-foreground">
                          {day}
                        </div>
                      ))}
                      {/* Sample calendar days */}
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const dateStr = `2026-03-${day.toString().padStart(2, "0")}`;
                        const isBlocked = artist?.availability?.blockedDates?.includes(dateStr);
                        const isBooked = artist?.availability?.bookedDates?.includes(dateStr);

                        return (
                          <button
                            key={day}
                            className={`rounded-lg py-2 text-sm transition-all ${isBooked
                              ? "bg-secondary text-secondary-foreground"
                              : isBlocked
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-green-500/20 text-green-700 hover:bg-green-500/40"
                              }`}
                            disabled={isBlocked || isBooked}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Button size="lg" className="bg-gradient-saffron" onClick={() => setIsBookingModalOpen(true)}>
                      <Calendar className="mr-2 h-5 w-5" />
                      Check Availability & Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {artist?.customerReviews?.length > 0 ? (
                    artist.customerReviews.map((review: any) => (
                      <div key={review.id || review._id} className="rounded-lg border border-border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {review.user?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{review.user || 'User'}</p>
                              <p className="text-xs text-muted-foreground">{review.date || 'Recent'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (review.rating || 0) ? "fill-accent text-accent" : "text-muted"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment || 'No comment provided.'}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No reviews yet for this artist.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section >
    </MainLayout >
  );
};

export default ArtistProfile;
