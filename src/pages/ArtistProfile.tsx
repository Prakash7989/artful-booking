import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Calendar, Clock, Users, Award, Play, 
  ChevronLeft, ChevronRight, Heart, Share2, CheckCircle,
  Phone, Mail, Music, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";

// Mock artist data - in production this would come from API
const mockArtist = {
  id: "1",
  name: "Lakshmi Devi",
  title: "Bharatanatyam Maestro",
  artForms: ["Bharatanatyam", "Kuchipudi"],
  state: "Tamil Nadu",
  city: "Chennai",
  rating: 4.9,
  reviewCount: 127,
  experience: "25 years",
  performances: 500,
  students: 200,
  available: true,
  verified: true,
  bio: "Lakshmi Devi is a renowned Bharatanatyam dancer and Kuchipudi artist with over 25 years of experience. She learned from legendary gurus at Kalakshetra, Chennai, and has performed across India and internationally. Her performances are known for their grace, precision, and emotional depth.",
  story: "Born into a family of artists in Tamil Nadu, Lakshmi began her dance journey at the age of 5. She trained rigorously under Padma Bhushan awardee Guru Ramachandran and went on to perform at prestigious venues including the Royal Albert Hall, Lincoln Center, and Sydney Opera House.",
  awards: [
    "Sangeet Natak Akademi Award 2019",
    "Kalaimamani Award 2015",
    "Nritya Choodamani 2012"
  ],
  gallery: [
    { id: 1, type: "image", url: "/placeholder.svg", title: "Classical Performance" },
    { id: 2, type: "image", url: "/placeholder.svg", title: "Temple Festival" },
    { id: 3, type: "image", url: "/placeholder.svg", title: "International Show" },
    { id: 4, type: "image", url: "/placeholder.svg", title: "Award Ceremony" },
    { id: 5, type: "video", url: "/placeholder.svg", title: "Live Performance", thumbnail: "/placeholder.svg" },
    { id: 6, type: "image", url: "/placeholder.svg", title: "Workshop Session" },
  ],
  pricing: {
    base: 15000,
    perHour: 5000,
    packages: [
      { name: "Solo Performance", duration: "1 hour", price: 15000, description: "Single artist performance with pre-recorded music" },
      { name: "Duo Performance", duration: "1.5 hours", price: 25000, description: "Two artists with live musician accompaniment" },
      { name: "Full Troupe", duration: "2 hours", price: 45000, description: "5 dancers with full orchestra and lighting" },
      { name: "Workshop", duration: "3 hours", price: 20000, description: "Interactive dance workshop for up to 30 participants" },
    ],
    addOns: [
      { name: "Live Music Ensemble", price: 10000 },
      { name: "Traditional Costume Rental", price: 3000 },
      { name: "Travel outside city", price: 5000 },
    ]
  },
  availability: {
    // Calendar data - dates that are blocked
    blockedDates: ["2025-02-10", "2025-02-15", "2025-02-20", "2025-02-25"],
    bookedDates: ["2025-02-08", "2025-02-12", "2025-02-18"],
  },
  pastPerformances: [
    { event: "Margazhi Festival", venue: "Music Academy, Chennai", date: "December 2024" },
    { event: "Cultural Evening", venue: "ITC Grand, Mumbai", date: "November 2024" },
    { event: "Temple Festival", venue: "Meenakshi Temple, Madurai", date: "October 2024" },
  ],
  customerReviews: [
    { id: 1, user: "Priya M.", rating: 5, comment: "Absolutely mesmerizing performance! The entire audience was spellbound.", date: "Jan 2025" },
    { id: 2, user: "Rahul K.", rating: 5, comment: "Lakshmi ji brought such grace and beauty to our daughter's wedding. Highly recommended!", date: "Dec 2024" },
    { id: 3, user: "Anita S.", rating: 4, comment: "Wonderful performer. Very professional and punctual.", date: "Nov 2024" },
  ]
};

const ArtistProfile = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // In production, fetch artist by id
  const artist = mockArtist;

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % artist.gallery.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + artist.gallery.length) % artist.gallery.length);
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
                  src={artist.gallery[currentGalleryIndex].url}
                  alt={artist.gallery[currentGalleryIndex].title}
                  className="h-full w-full object-cover"
                />
                {artist.gallery[currentGalleryIndex].type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <Button size="lg" className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary">
                      <Play className="h-8 w-8 fill-primary-foreground" />
                    </Button>
                  </div>
                )}
                
                {/* Navigation */}
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

                {/* Counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm">
                  {currentGalleryIndex + 1} / {artist.gallery.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {artist.gallery.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      index === currentGalleryIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                    {item.type === "video" && (
                      <Play className="absolute inset-0 m-auto h-5 w-5 text-primary-foreground drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {artist.verified && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
                {artist.available ? (
                  <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Available</Badge>
                ) : (
                  <Badge variant="secondary">Currently Booked</Badge>
                )}
              </div>

              <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                {artist.name}
              </h1>
              <p className="mb-4 text-lg text-primary">{artist.title}</p>

              {/* Art Forms */}
              <div className="mb-4 flex flex-wrap gap-2">
                {artist.artForms.map((art) => (
                  <Badge key={art} variant="outline" className="border-primary/30 bg-primary/5">
                    <Palette className="mr-1 h-3 w-3" /> {art}
                  </Badge>
                ))}
              </div>

              {/* Rating & Location */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{artist.rating}</span>
                  <span className="text-muted-foreground">({artist.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {artist.city}, {artist.state}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-4">
                <div className="text-center">
                  <Clock className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">{artist.experience}</p>
                  <p className="text-xs text-muted-foreground">Experience</p>
                </div>
                <div className="text-center">
                  <Music className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">{artist.performances}+</p>
                  <p className="text-xs text-muted-foreground">Performances</p>
                </div>
                <div className="text-center">
                  <Users className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">{artist.students}+</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <p className="text-3xl font-bold text-foreground">
                      ₹{artist.pricing.base.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">per performance</span>
                </div>
                
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 bg-gradient-saffron text-lg hover:opacity-90">
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
                  <Button size="lg" variant="outline" className="border-primary/30">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
                    <p className="text-muted-foreground">{artist.bio}</p>
                    <p className="text-muted-foreground">{artist.story}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-accent" />
                      Awards & Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.awards.map((award, index) => (
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

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Past Performances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {artist.pastPerformances.map((perf, index) => (
                        <div key={index} className="rounded-lg border border-border bg-muted/30 p-4">
                          <p className="font-semibold text-foreground">{perf.event}</p>
                          <p className="text-sm text-muted-foreground">{perf.venue}</p>
                          <p className="mt-2 text-xs text-primary">{perf.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
                    {artist.pricing.packages.map((pkg, index) => (
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
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add-ons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {artist.pricing.addOns.map((addon, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <span className="text-foreground">{addon.name}</span>
                        <span className="font-semibold text-primary">
                          +₹{addon.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
                      <h4 className="font-semibold">February 2025</h4>
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
                      {Array.from({ length: 28 }, (_, i) => {
                        const day = i + 1;
                        const dateStr = `2025-02-${day.toString().padStart(2, "0")}`;
                        const isBlocked = artist.availability.blockedDates.includes(dateStr);
                        const isBooked = artist.availability.bookedDates.includes(dateStr);
                        
                        return (
                          <button
                            key={day}
                            className={`rounded-lg py-2 text-sm transition-all ${
                              isBooked
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
                    <Button size="lg" className="bg-gradient-saffron">
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
                  {artist.customerReviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{review.user}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-accent text-accent" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default ArtistProfile;
