import { motion } from "framer-motion";
import { Star, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for featured artists
const featuredArtists = [
  {
    id: "1",
    name: "Lakshmi Devi",
    artForm: "Bharatanatyam",
    state: "Tamil Nadu",
    rating: 4.9,
    reviews: 127,
    price: 15000,
    experience: "25 years",
    image: "👩‍🎨",
    available: true,
  },
  {
    id: "2",
    name: "Rajendra Singh",
    artForm: "Rajasthani Folk",
    state: "Rajasthan",
    rating: 4.8,
    reviews: 89,
    price: 12000,
    experience: "18 years",
    image: "👨‍🎨",
    available: true,
  },
  {
    id: "3",
    name: "Krishnan Nair",
    artForm: "Kathakali",
    state: "Kerala",
    rating: 5.0,
    reviews: 156,
    price: 20000,
    experience: "30 years",
    image: "🎭",
    available: false,
  },
  {
    id: "4",
    name: "Meera Sharma",
    artForm: "Kathak",
    state: "Uttar Pradesh",
    rating: 4.7,
    reviews: 94,
    price: 18000,
    experience: "22 years",
    image: "💃",
    available: true,
  },
  {
    id: "5",
    name: "Baul Sangeet Group",
    artForm: "Baul Music",
    state: "West Bengal",
    rating: 4.9,
    reviews: 112,
    price: 25000,
    experience: "20 years",
    image: "🎵",
    available: true,
  },
];

const FeaturedArtists = () => {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-primary"
            >
              Top Performers
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl font-bold text-foreground md:text-4xl"
            >
              Featured Artists
            </motion.h2>
          </div>
          <Button asChild variant="outline" className="border-primary/30">
            <Link to="/artists">View All Artists</Link>
          </Button>
        </div>

        {/* Artists Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredArtists.map((artist) => (
              <CarouselItem key={artist.id} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-primary/30 bg-background hover:bg-primary/10" />
          <CarouselNext className="right-0 border-primary/30 bg-background hover:bg-primary/10" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedArtists;
