const State = require('../models/State');
const ArtForm = require('../models/ArtForm');

const states = [
  // South
  { id: "andhra-pradesh", name: "Andhra Pradesh", region: "South", icon: "🏛️", description: "Andhra Pradesh is a treasure trove of classical and folk arts. The state is renowned for its Kuchipudi dance.", culturalHighlights: ["Birthplace of Kuchipudi classical dance", "Rich tradition of Carnatic music"] },
  { id: "karnataka", name: "Karnataka", region: "South", icon: "🎭", description: "Home to Yakshagana and Carnatic music traditions.", culturalHighlights: ["Yakshagana", "Carnatic Music", "Mysore Dasara"] },
  { id: "kerala", name: "Kerala", region: "South", icon: "🌴", description: "Kerala is known for its classical arts and ritualistic performances.", culturalHighlights: ["Kathakali dance", "Theyyam rituals", "Mohiniyattam"] },
  { id: "tamil-nadu", name: "Tamil Nadu", region: "South", icon: "🛕", description: "Tamil Nadu is home to one of the world's oldest cultures.", culturalHighlights: ["Bharatanatyam", "Carnatic music", "Pongal festivals"] },
  { id: "telangana", name: "Telangana", region: "South", icon: "🏰", description: "Known for its rich history and Perini Sivatandavam.", culturalHighlights: ["Perini Sivatandavam", "Bathukamma"] },

  // North
  { id: "haryana", name: "Haryana", region: "North", icon: "🌾", description: "Rich in folk music and Swang theater.", culturalHighlights: ["Swang theater", "Phag dance"] },
  { id: "himachal-pradesh", name: "Himachal Pradesh", region: "North", icon: "🏔️", description: "Famous for Pahari paintings and Nati dance.", culturalHighlights: ["Nati dance", "Pahari painting"] },
  { id: "punjab", name: "Punjab", region: "North", icon: "🥁", description: "The land of vibrant Bhangra and Gidda.", culturalHighlights: ["Bhangra", "Gidda", "Phulkari embroidery"] },
  { id: "rajasthan", name: "Rajasthan", region: "North", icon: "🏜️", description: "Land of Kings, Rajasthan has a vivid cultural history.", culturalHighlights: ["Ghoomar dance", "Kalbelia folk dance", "Kathputli"] },
  { id: "uttar-pradesh", name: "Uttar Pradesh", region: "North", icon: "🕍", description: "The heartland of Kathak and Hindustani classical music.", culturalHighlights: ["Kathak classical dance", "Hindustani Music", "Chikan embroidery"] },
  { id: "uttarakhand", name: "Uttarakhand", region: "North", icon: "⛰️", description: "Known for Choliya dance and folk songs of the hills.", culturalHighlights: ["Choliya dance", "Garhwali and Kumaoni folk music"] },

  // West
  { id: "goa", name: "Goa", region: "West", icon: "🏖️", description: "A unique blend of Indian and Portuguese influences.", culturalHighlights: ["Mando music", "Dekhni dance", "Carnival"] },
  { id: "gujarat", name: "Gujarat", region: "West", icon: "🕯️", description: "Famous for Garba and its rich textile traditions.", culturalHighlights: ["Garba and Dandiya Raas", "Patola weaving"] },
  { id: "maharashtra", name: "Maharashtra", region: "West", icon: "🚩", description: "Rich traditions of Lavani and Ganesh Chaturthi.", culturalHighlights: ["Lavani dance", "Warli painting", "Povada"] },

  // East
  { id: "bihar", name: "Bihar", region: "East", icon: "🎨", description: "Home to the ancient Madhubani art and folk traditions.", culturalHighlights: ["Madhubani painting", "Bidesiya folk theater"] },
  { id: "jharkhand", name: "Jharkhand", region: "East", icon: "🏹", description: "Vibrant tribal arts and Chhau dance.", culturalHighlights: ["Chhau dance", "Sohrai and Khovar art"] },
  { id: "odisha", name: "Odisha", region: "East", icon: "🐚", description: "The land of Odissi and Pattachitra.", culturalHighlights: ["Odissi classical dance", "Pattachitra painting", "Gotipua"] },
  { id: "west-bengal", name: "West Bengal", region: "East", icon: "🎨", description: "A cultural hub known for Baul music and Terracotta art.", culturalHighlights: ["Baul music", "Terracotta art", "Dhokra craft"] },

  // Central
  { id: "chhattisgarh", name: "Chhattisgarh", region: "Central", icon: "🐘", description: "Known for Panthi dance and tribal art.", culturalHighlights: ["Panthi dance", "Bastar handicraft"] },
  { id: "madhya-pradesh", name: "Madhya Pradesh", region: "Central", icon: "🐅", description: "The heart of India with rich tribal and classical heritage.", culturalHighlights: ["Khajuraho Dance Festival", "Gond painting", "Maach folk theater"] },

  // Northeast
  { id: "arunachal-pradesh", name: "Arunachal Pradesh", region: "Northeast", icon: "🏔️", description: "Diverse tribal cultures and Buddhist influences.", culturalHighlights: ["Tibetan Buddhist traditions", "Tribal dances"] },
  { id: "assam", name: "Assam", region: "Northeast", icon: "🍵", description: "Land of the red river and blue hills, and Bihu.", culturalHighlights: ["Bihu dance", "Sattriya classical dance", "Muga silk"] },
  { id: "manipur", name: "Manipur", region: "Northeast", icon: "⚔️", description: "Exquisite Manipuri dance and martial arts.", culturalHighlights: ["Manipuri classical dance", "Thang-Ta martial arts"] },
  { id: "meghalaya", name: "Meghalaya", region: "Northeast", icon: "☁️", description: "The abode of clouds with vibrant music traditions.", culturalHighlights: ["Wangala dance", "Shad Suk Mynsiem"] },
  { id: "mizoram", name: "Mizoram", region: "Northeast", icon: "🎋", description: "Known for the bamboo dance (Cheraw).", culturalHighlights: ["Cheraw dance", "Khuallam"] },
  { id: "nagaland", name: "Nagaland", region: "Northeast", icon: "🎭", description: "Land of festivals and diverse tribal heritage.", culturalHighlights: ["Hornbill Festival", "Spear dance"] },
  { id: "sikkim", name: "Sikkim", region: "Northeast", icon: "🧘", description: "Buddhist traditions and vibrant masked dances.", culturalHighlights: ["Cham dance", "Thangka painting"] },
  { id: "tripura", name: "Tripura", region: "Northeast", icon: "🎋", description: "Blend of tribal and Bengali cultures.", culturalHighlights: ["Hojagiri dance", "Bamboo and cane crafts"] },

  // Islands & UTs
  { id: "andaman-nicobar", name: "Andaman & Nicobar Islands", region: "Islands", icon: "🏝️", description: "Unique island cultures and tribal traditions.", culturalHighlights: ["Indigenous tribal art", "Nicobari dance"] },
  { id: "chandigarh", name: "Chandigarh", region: "North", icon: "🏗️", description: "A modern city blending tradition with urban planning.", culturalHighlights: ["Rock Garden art", "Folk festivals"] },
  { id: "dadra-nagar-haveli-daman-diu", name: "Dadra & Nagar Haveli and Daman & Diu", region: "West", icon: "🏖️", description: "Coastal traditions and tribal heritage.", culturalHighlights: ["Tarpa dance", "Folk festivals"] },
  { id: "delhi", name: "Delhi", region: "North", icon: "🕌", description: "The melting pot of Indian cultures.", culturalHighlights: ["Diverse culinary arts", "Historical monuments", "Qawwali"] },
  { id: "jammu-kashmir", name: "Jammu & Kashmir", region: "North", icon: "❄️", description: "Known for Sufi music and intricate handicrafts.", culturalHighlights: ["Sufiana Kalam", "Pashmina weaving", "Rouf dance"] },
  { id: "ladakh", name: "Ladakh", region: "North", icon: "🏔️", description: "The land of high passes and Buddhist culture.", culturalHighlights: ["Cham dance", "Buddhist chanting", "Metal work"] },
  { id: "lakshadweep", name: "Lakshadweep", region: "Islands", icon: "🌊", description: "Marine heritage and traditional folk dances.", culturalHighlights: ["Lava dance", "Kolkali"] },
  { id: "puducherry", name: "Puducherry", region: "South", icon: "🇫🇷", description: "A unique blend of French and Tamil cultures.", culturalHighlights: ["French architecture", "Tamil folk arts"] },
];

const artForms = [
  { name: "Kuchipudi", type: "Classical Dance", description: "Grace and dramatic storytelling", state: "andhra-pradesh" },
  { name: "Bharatanatyam", type: "Classical Dance", description: "Major form of Indian classical dance", state: "tamil-nadu" },
  { name: "Kathakali", type: "Classical Dance", description: "Story play genre of art", state: "kerala" },
  { name: "Theyyam", type: "Folk Dance", description: "Popular ritual form of worship", state: "kerala" },
  { name: "Ghoomar", type: "Folk Dance", description: "Traditional folk dance of Rajasthan", state: "rajasthan" },
];

const seedData = async () => {
  try {
    // Better seeding logic: Upsert states to avoid duplicates and ensure all are added
    for (const stateData of states) {
      await State.findOneAndUpdate(
        { id: stateData.id },
        stateData,
        { upsert: true, new: true }
      );
    }
    console.log(`${states.length} States updated/seeded successfully`);

    const artFormCount = await ArtForm.countDocuments();
    if (artFormCount === 0) {
      await ArtForm.insertMany(artForms);
      console.log('ArtForms seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
