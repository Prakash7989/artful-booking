import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Filter, Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";

// Mock artists data
const allArtists = [
  { id: "1", name: "Lakshmi Devi", artForm: "Bharatanatyam", state: "Tamil Nadu", rating: 4.9, reviews: 127, price: 15000, experience: "25 years", image: "👩‍🎨", available: true },
  { id: "2", name: "Rajendra Singh", artForm: "Rajasthani Folk", state: "Rajasthan", rating: 4.8, reviews: 89, price: 12000, experience: "18 years", image: "👨‍🎨", available: true },
  { id: "3", name: "Krishnan Nair", artForm: "Kathakali", state: "Kerala", rating: 5.0, reviews: 156, price: 20000, experience: "30 years", image: "🎭", available: false },
  { id: "4", name: "Meera Sharma", artForm: "Kathak", state: "Uttar Pradesh", rating: 4.7, reviews: 94, price: 18000, experience: "22 years", image: "💃", available: true },
  { id: "5", name: "Baul Sangeet Group", artForm: "Baul Music", state: "West Bengal", rating: 4.9, reviews: 112, price: 25000, experience: "20 years", image: "🎵", available: true },
  { id: "6", name: "Odissi Dance Ensemble", artForm: "Odissi", state: "Odisha", rating: 4.8, reviews: 78, price: 22000, experience: "15 years", image: "🩰", available: true },
  { id: "7", name: "Pandit Ramesh Kumar", artForm: "Hindustani Classical", state: "Maharashtra", rating: 4.9, reviews: 145, price: 30000, experience: "35 years", image: "🎻", available: false },
  { id: "8", name: "Lavani Troupe Mumbai", artForm: "Lavani", state: "Maharashtra", rating: 4.6, reviews: 67, price: 15000, experience: "12 years", image: "🪘", available: true },
  { id: "9", name: "Giddha Queens Punjab", artForm: "Giddha", state: "Punjab", rating: 4.7, reviews: 82, price: 18000, experience: "14 years", image: "👯", available: true },
  { id: "10", name: "Manipuri Dance Academy", artForm: "Manipuri", state: "Manipur", rating: 4.8, reviews: 56, price: 20000, experience: "18 years", image: "🌸", available: true },
  { id: "11", name: "Theyyam Artists Kerala", artForm: "Theyyam", state: "Kerala", rating: 5.0, reviews: 98, price: 35000, experience: "25 years", image: "🔥", available: true },
  { id: "12", name: "Chhau Dance Group", artForm: "Chhau", state: "Jharkhand", rating: 4.7, reviews: 43, price: 16000, experience: "16 years", image: "🎪", available: false },
];

const artForms = ["All Art Forms", "Bharatanatyam", "Kathak", "Kathakali", "Odissi", "Manipuri", "Rajasthani Folk", "Baul Music", "Lavani", "Hindustani Classical"];
const states = ["All States", "Tamil Nadu", "Rajasthan", "Kerala", "Uttar Pradesh", "West Bengal", "Odisha", "Maharashtra", "Punjab", "Manipur", "Jharkhand"];

const Artists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtForm, setSelectedArtForm] = useState("All Art Forms");
  const [selectedState, setSelectedState] = useState("All States");
  const [sortBy, setSortBy] = useState("rating");

  const filteredArtists = allArtists
    .filter((artist) => {
      const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.artForm.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArtForm = selectedArtForm === "All Art Forms" || artist.artForm === selectedArtForm;
      const matchesState = selectedState === "All States" || artist.state === selectedState;
      return matchesSearch && matchesArtForm && matchesState;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream via-background to-muted py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
              Find Your Perfect <span className="text-gradient-saffron">Artist</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Browse through our curated collection of verified traditional artists. 
              Filter by art form, state, or search by name.
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search artists or art forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-border bg-card pl-12 text-base shadow-warm focus-visible:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedArtForm} onValueChange={setSelectedArtForm}>
              <SelectTrigger className="w-[180px] border-border">
                <SelectValue placeholder="Art Form" />
              </SelectTrigger>
              <SelectContent>
                {artForms.map((artForm) => (
                  <SelectItem key={artForm} value={artForm}>{artForm}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-[180px] border-border">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {filteredArtists.length} artists
          </p>

          {/* Artists Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/artists/${artist.id}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-warm"
                >
                  {/* Artist Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {artist.image}
                    </div>
                    {/* Availability Badge */}
                    <div className="absolute right-3 top-3">
                      <Badge
                        variant={artist.available ? "default" : "secondary"}
                        className={artist.available ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {artist.available ? "Available" : "Booked"}
                      </Badge>
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-primary">{artist.artForm}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{artist.rating}</span>
                        <span className="text-muted-foreground">({artist.reviews})</span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{artist.state}</span>
                      <span className="text-border">•</span>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{artist.experience}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Starting from</span>
                        <p className="font-semibold text-foreground">
                          ₹{artist.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Button size="sm" className="bg-gradient-saffron hover:opacity-90">
                        View Profile
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredArtists.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">No artists found matching your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedArtForm("All Art Forms");
                  setSelectedState("All States");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Artists;
