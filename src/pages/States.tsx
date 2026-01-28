import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

// All 36 states and UTs of India
const allStates = [
  { id: "andhra-pradesh", name: "Andhra Pradesh", region: "South", artForms: 8, artists: 28, icon: "🏛️" },
  { id: "arunachal-pradesh", name: "Arunachal Pradesh", region: "Northeast", artForms: 6, artists: 12, icon: "🏔️" },
  { id: "assam", name: "Assam", region: "Northeast", artForms: 9, artists: 24, icon: "🍵" },
  { id: "bihar", name: "Bihar", region: "East", artForms: 7, artists: 18, icon: "📜" },
  { id: "chhattisgarh", name: "Chhattisgarh", region: "Central", artForms: 6, artists: 15, icon: "🌲" },
  { id: "goa", name: "Goa", region: "West", artForms: 5, artists: 10, icon: "🏖️" },
  { id: "gujarat", name: "Gujarat", region: "West", artForms: 9, artists: 35, icon: "🎪" },
  { id: "haryana", name: "Haryana", region: "North", artForms: 6, artists: 20, icon: "🌾" },
  { id: "himachal-pradesh", name: "Himachal Pradesh", region: "North", artForms: 7, artists: 18, icon: "❄️" },
  { id: "jharkhand", name: "Jharkhand", region: "East", artForms: 8, artists: 16, icon: "🏞️" },
  { id: "karnataka", name: "Karnataka", region: "South", artForms: 11, artists: 42, icon: "🎭" },
  { id: "kerala", name: "Kerala", region: "South", artForms: 12, artists: 45, icon: "🌴" },
  { id: "madhya-pradesh", name: "Madhya Pradesh", region: "Central", artForms: 8, artists: 22, icon: "🏰" },
  { id: "maharashtra", name: "Maharashtra", region: "West", artForms: 11, artists: 48, icon: "🏛️" },
  { id: "manipur", name: "Manipur", region: "Northeast", artForms: 7, artists: 20, icon: "💃" },
  { id: "meghalaya", name: "Meghalaya", region: "Northeast", artForms: 5, artists: 12, icon: "☁️" },
  { id: "mizoram", name: "Mizoram", region: "Northeast", artForms: 5, artists: 10, icon: "🎋" },
  { id: "nagaland", name: "Nagaland", region: "Northeast", artForms: 6, artists: 14, icon: "🦅" },
  { id: "odisha", name: "Odisha", region: "East", artForms: 13, artists: 41, icon: "🏺" },
  { id: "punjab", name: "Punjab", region: "North", artForms: 7, artists: 28, icon: "🎺" },
  { id: "rajasthan", name: "Rajasthan", region: "North", artForms: 15, artists: 58, icon: "🏜️" },
  { id: "sikkim", name: "Sikkim", region: "Northeast", artForms: 5, artists: 8, icon: "🗻" },
  { id: "tamil-nadu", name: "Tamil Nadu", region: "South", artForms: 14, artists: 62, icon: "🛕" },
  { id: "telangana", name: "Telangana", region: "South", artForms: 7, artists: 25, icon: "🏰" },
  { id: "tripura", name: "Tripura", region: "Northeast", artForms: 5, artists: 11, icon: "🎍" },
  { id: "uttar-pradesh", name: "Uttar Pradesh", region: "North", artForms: 12, artists: 52, icon: "🕌" },
  { id: "uttarakhand", name: "Uttarakhand", region: "North", artForms: 7, artists: 18, icon: "⛰️" },
  { id: "west-bengal", name: "West Bengal", region: "East", artForms: 10, artists: 38, icon: "🎭" },
  // Union Territories
  { id: "andaman-nicobar", name: "Andaman & Nicobar", region: "Islands", artForms: 3, artists: 5, icon: "🏝️" },
  { id: "chandigarh", name: "Chandigarh", region: "North", artForms: 4, artists: 8, icon: "🌳" },
  { id: "dadra-nagar-haveli", name: "Dadra & Nagar Haveli", region: "West", artForms: 4, artists: 6, icon: "🌿" },
  { id: "daman-diu", name: "Daman & Diu", region: "West", artForms: 3, artists: 5, icon: "⚓" },
  { id: "delhi", name: "Delhi", region: "North", artForms: 8, artists: 35, icon: "🏙️" },
  { id: "jammu-kashmir", name: "Jammu & Kashmir", region: "North", artForms: 9, artists: 22, icon: "🏔️" },
  { id: "ladakh", name: "Ladakh", region: "North", artForms: 5, artists: 10, icon: "🏜️" },
  { id: "lakshadweep", name: "Lakshadweep", region: "Islands", artForms: 3, artists: 4, icon: "🐚" },
  { id: "puducherry", name: "Puducherry", region: "South", artForms: 5, artists: 12, icon: "🌊" },
];

const regions = ["All", "North", "South", "East", "West", "Central", "Northeast", "Islands"];

const States = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filteredStates = allStates.filter((state) => {
    const matchesSearch = state.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "All" || state.region === selectedRegion;
    return matchesSearch && matchesRegion;
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
              Explore Artists by <span className="text-gradient-saffron">State</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Discover the rich cultural heritage of India through its diverse states. 
              Each state has unique folk traditions and classical art forms.
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search states..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-border bg-card pl-12 text-base shadow-warm focus-visible:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Region Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className={
                  selectedRegion === region
                    ? "bg-gradient-saffron"
                    : "border-border hover:border-primary hover:bg-primary/5"
                }
              >
                {region}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {filteredStates.length} of {allStates.length} states & territories
          </p>

          {/* States Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStates.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/states/${state.id}`}
                  className="group relative block overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-warm"
                >
                  {/* Icon Background */}
                  <div className="absolute -right-4 -top-4 text-7xl opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-20">
                    {state.icon}
                  </div>

                  <div className="relative">
                    {/* Region Badge */}
                    <span className="mb-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {state.region}
                    </span>

                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground group-hover:text-primary">
                      {state.name}
                    </h3>

                    <div className="mb-4 flex gap-3 text-sm text-muted-foreground">
                      <span>{state.artForms} Art Forms</span>
                      <span>•</span>
                      <span>{state.artists} Artists</span>
                    </div>

                    <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredStates.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">No states found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default States;
