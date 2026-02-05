import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, MapPin, Users, Palette, Music, 
  Star, Calendar, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

// Mock state data - in production this would come from API
const statesData: Record<string, {
  id: string;
  name: string;
  region: string;
  icon: string;
  description: string;
  culturalHighlights: string[];
  artForms: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    image: string;
  }>;
  featuredArtists: Array<{
    id: string;
    name: string;
    artForm: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    available: boolean;
  }>;
}> = {
  "andhra-pradesh": {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    region: "South India",
    icon: "🏛️",
    description: "Andhra Pradesh is a treasure trove of classical and folk arts. The state is renowned for its Kuchipudi dance, which originated in the village of Kuchipudi, and its vibrant folk traditions like Burrakatha and Harikatha. The rich musical heritage includes Carnatic music and various folk songs that celebrate the agricultural and cultural life of the region.",
    culturalHighlights: [
      "Birthplace of Kuchipudi classical dance",
      "Rich tradition of Carnatic music",
      "Famous for Kalamkari textile art",
      "Vibrant temple festival traditions",
      "Traditional shadow puppetry (Tholu Bommalata)"
    ],
    artForms: [
      { id: "kuchipudi", name: "Kuchipudi", type: "Classical Dance", description: "One of the eight major classical dances of India, known for its grace and dramatic storytelling", image: "/placeholder.svg" },
      { id: "burrakatha", name: "Burrakatha", type: "Folk Theatre", description: "A traditional oral storytelling art form with music and dance", image: "/placeholder.svg" },
      { id: "kolattam", name: "Kolattam", type: "Folk Dance", description: "A rhythmic stick dance performed during festivals", image: "/placeholder.svg" },
      { id: "carnatic", name: "Carnatic Music", type: "Classical Music", description: "South Indian classical music tradition with rich melodic and rhythmic systems", image: "/placeholder.svg" },
      { id: "tholu-bommalata", name: "Tholu Bommalata", type: "Puppetry", description: "Traditional leather shadow puppet theatre", image: "/placeholder.svg" },
      { id: "harikatha", name: "Harikatha", type: "Musical Storytelling", description: "Religious storytelling through music and narrative", image: "/placeholder.svg" },
    ],
    featuredArtists: [
      { id: "1", name: "Padmini Rao", artForm: "Kuchipudi", rating: 4.9, reviews: 89, price: 18000, image: "👩‍🎨", available: true },
      { id: "2", name: "Guru Venkatesh", artForm: "Carnatic Music", rating: 5.0, reviews: 124, price: 25000, image: "🎵", available: true },
      { id: "3", name: "Burrakatha Ramaiah", artForm: "Burrakatha", rating: 4.7, reviews: 45, price: 12000, image: "🎭", available: false },
      { id: "4", name: "Kolattam Troupe Vijayawada", artForm: "Kolattam", rating: 4.8, reviews: 67, price: 15000, image: "🪘", available: true },
    ]
  },
  // Add more states as needed - using default for unmatched
};

const defaultState = {
  id: "unknown",
  name: "State",
  region: "India",
  icon: "🇮🇳",
  description: "This state has a rich cultural heritage with diverse folk and classical art traditions. Explore the artists and art forms that make this region unique.",
  culturalHighlights: [
    "Rich folk traditions",
    "Classical music and dance",
    "Traditional crafts",
    "Festival celebrations"
  ],
  artForms: [
    { id: "folk-dance", name: "Folk Dance", type: "Folk Dance", description: "Traditional dance forms of the region", image: "/placeholder.svg" },
    { id: "folk-music", name: "Folk Music", type: "Folk Music", description: "Traditional music and songs", image: "/placeholder.svg" },
  ],
  featuredArtists: []
};

const StateDetail = () => {
  const { stateId } = useParams();
  const state = statesData[stateId || ""] || { ...defaultState, name: stateId?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "State" };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/states" className="hover:text-primary">Explore States</Link>
            <span>/</span>
            <span className="text-foreground">{state.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-20">
        <div className="absolute -right-20 -top-20 text-[200px] opacity-10">
          {state.icon}
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <MapPin className="mr-1 h-3 w-3" />
              {state.region}
            </Badge>
            <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              {state.name}
            </h1>
            <p className="mb-6 text-lg text-muted-foreground md:text-xl">
              {state.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-warm">
                <Palette className="h-5 w-5 text-primary" />
                <span className="font-medium">{state.artForms.length} Art Forms</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-warm">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">{state.featuredArtists.length}+ Artists</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cultural Highlights */}
      <section className="py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 font-display text-2xl font-bold text-foreground md:text-3xl">
              Cultural Highlights
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {state.culturalHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Art Forms */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Traditional Art Forms
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.artForms.map((artForm, index) => (
              <motion.div
                key={artForm.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full overflow-hidden transition-all hover:border-primary/30 hover:shadow-warm">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                    <img
                      src={artForm.image}
                      alt={artForm.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute right-3 top-3 bg-card/90">
                      {artForm.type}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="mb-2 font-display text-xl font-semibold text-foreground group-hover:text-primary">
                      {artForm.name}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {artForm.description}
                    </p>
                    <Link
                      to={`/artists?artForm=${artForm.name}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      View Artists
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      {state.featuredArtists.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Featured Artists from {state.name}
              </h2>
              <Link to={`/artists?state=${state.name}`}>
                <Button variant="outline" className="border-primary/30">
                  View All Artists
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {state.featuredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/artists/${artist.id}`}
                    className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-warm"
                  >
                    {/* Artist Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {artist.image}
                      </div>
                      <Badge
                        className={`absolute right-3 top-3 ${
                          artist.available ? "bg-green-500 hover:bg-green-600" : ""
                        }`}
                        variant={artist.available ? "default" : "secondary"}
                      >
                        {artist.available ? "Available" : "Booked"}
                      </Badge>
                    </div>

                    {/* Artist Info */}
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                        {artist.name}
                      </h3>
                      <p className="mb-2 text-sm text-primary">{artist.artForm}</p>
                      
                      <div className="mb-3 flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{artist.rating}</span>
                        <span className="text-muted-foreground">({artist.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <div>
                          <span className="text-xs text-muted-foreground">From</span>
                          <p className="font-semibold text-foreground">
                            ₹{artist.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Button size="sm" className="bg-gradient-saffron hover:opacity-90">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-16">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground md:text-3xl">
            Ready to Book an Artist from {state.name}?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Explore our curated selection of verified traditional artists and book instantly for your event.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={`/artists?state=${state.name}`}>
              <Button size="lg" className="bg-gradient-saffron hover:opacity-90">
                Browse All Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/states">
              <Button size="lg" variant="outline" className="border-primary/30">
                Explore Other States
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default StateDetail;
