export const uiContent = `
# UI/UX & Frontend Screen Flows

The UI must be completely usable on a weak 3G connection. This means avoiding heavy framework bloat, using SVG icons over PNGs, and rendering data before fetching images. All screens must be designed for RTL (Right-to-Left) reading for Pashto/Dari. 

## 1. Low-Data UI Principles
*   **Skeleton Loaders instead of Spinners:** Give the user the illusion that the screen has already loaded.
*   **Lazy Loading Images:** Doctor profile pictures should *only* load when they scroll into the viewport.
*   **System Fonts:** Do not download heavy custom web fonts (like Google Fonts) on app startup. Fallback to system fonts (San Francisco/Roboto) instantly.
*   **RTL Built-In:** The UI must mirror perfectly for Pashto/Dari using React Native's \`I18nManager.forceRTL(true)\`.

## 2. Patient App Screen Flows (React Native Implementation)

### A. Home Screen (Dashboard)

This component is ultra-lightweight, prioritizing cached data and using minimal external assets.

\`\`\`typescript
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, I18nManager } from 'react-native';
import { Search, Heart, Activity, Stethoscope } from 'lucide-react-native'; // Lightweight SVGs

// Force RTL layout for Pashto/Dari
I18nManager.forceRTL(true);

export const PatientHome = ({ userData, cachedDoctors }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>سلام، {userData.name}</Text>
        <Text style={styles.location}>مزارشریف (Mazar-e-Sharif)</Text>
      </View>

      {/* Massive Search Bar (Offline Capable) */}
      <TouchableOpacity style={styles.searchBar}>
        <Search color="#64748B" size={20} />
        <Text style={styles.searchText}>جستجوی داکتر، شفاخانه یا بیماری</Text>
      </TouchableOpacity>

      {/* Quick Categories */}
      <View style={styles.grid}>
        <CategoryIcon icon={<Heart color="#EF4444" />} label="متخصص قلب" />
        <CategoryIcon icon={<Activity color="#3B82F6" />} label="لابراتوار" />
        <CategoryIcon icon={<Stethoscope color="#10B981" />} label="داکتر عمومی" />
      </View>

      {/* Horizontal Scroll (Top Rated - Cached) */}
      <Text style={styles.sectionTitle}>بهترین داکتران نزدیک شما</Text>
      <FlatList 
        horizontal
        data={cachedDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' },
  location: { fontSize: 14, color: '#64748B', alignSelf: 'center' },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', 
    padding: 14, borderRadius: 12, elevation: 2, marginBottom: 24 
  },
  searchText: { marginHorizontal: 12, color: '#94A3B8', fontSize: 16 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16, textAlign: 'left' }
});
\`\`\`

### B. Doctor Profile Screen

Designed to establish trust via PMDC (registration) details, and handles slow imagery parsing.

\`\`\`typescript
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export const DoctorProfile = ({ doctor }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        {/* Uses a low-res placeholder before fetching the hi-res WebP image */}
        <Image 
          source={{ uri: doctor.avatarWebpUrl }} 
          defaultSource={{ uri: 'local-placeholder' }}
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{doctor.fullName}</Text>
          <Text style={styles.specialty}>{doctor.specialtyPashto} / {doctor.specialtyEnglish}</Text>
          <Text style={styles.pmdc}>شماره ثبت: {doctor.registrationNumber}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>تجربه: {doctor.experience} سال</Text>
        <Text style={styles.stat}>فیس: {doctor.fee} افغانی</Text>
      </View>

      {/* Maps are static images unless interacted with to save JS execution & data */}
      <Text style={styles.sectionTitle}>موقعیت معاینه خانه</Text>
      <Image 
        source={{ uri: \`https://maps.googleapis.com/maps/api/staticmap?center=\${doctor.lat},\${doctor.lng}&zoom=15&size=400x200&key=STATIC_KEY\` }} 
        style={styles.staticMap} 
      />

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookText}>اخذ نوبت (Book Token)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  profileHeader: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  headerInfo: { marginLeft: 16, justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' },
  specialty: { fontSize: 16, color: '#3B82F6', marginTop: 4, textAlign: 'left' },
  pmdc: { fontSize: 12, color: '#64748B', marginTop: 8, textAlign: 'left' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: '#F8FAFC' },
  stat: { fontSize: 15, fontWeight: '500', color: '#334155' },
  sectionTitle: { padding: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'left' },
  staticMap: { width: '100%', height: 200, backgroundColor: '#E2E8F0' },
  bookButton: { margin: 20, backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center' },
  bookText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});
\`\`\`

## 3. Booking Flow Logic (Cash-at-Clinic default)
Given the local context, digital payments are a barrier to entry. The booking flow defaults to Cash-at-Clinic.

1. **Select Branch:** The patient chooses whether the doctor is at "Hospital X" or "Private Clinic".
2. **Select Token:** The patient selects an available 15-minute window or "Queue Number".
3. **Checkout:** The app generates a 4-digit token ID. No digital transaction occurs.
4. **Offline Sync:** The app sends a lightweight SMS to the Doctor App's Twilio/RouteMobile gateway confirming the token.

Digital payments (HesabPay) are strictly gated for the WebRTC Telehealth features, where upfront payment is mandatory to protect the doctor's time.
`;
