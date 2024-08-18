import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import cores from '../../src/constants/colors';
import TherapistCard from '../../src/components/TherapistCard';
import { Therapist } from '../../src/types/user';
import { getTherapists } from '../../src/services/firestore';

export default function TherapistsScreen() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const fetchedTherapists = await getTherapists();
      setTherapists(fetchedTherapists);
      setFilteredTherapists(fetchedTherapists);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedSpecialization, selectedLanguage);
  };

  const handleSpecializationFilter = (specialization: string) => {
    const newSpecialization = selectedSpecialization === specialization ? '' : specialization;
    setSelectedSpecialization(newSpecialization);
    applyFilters(searchQuery, newSpecialization, selectedLanguage);
  };

  const handleLanguageFilter = (language: string) => {
    const newLanguage = selectedLanguage === language ? '' : language;
    setSelectedLanguage(newLanguage);
    applyFilters(searchQuery, selectedSpecialization, newLanguage);
  };

  const applyFilters = (query: string, specialization: string, language: string) => {
    let filtered = therapists;

    if (query) {
      filtered = filtered.filter(
        (therapist) =>
          therapist.firstName.toLowerCase().includes(query.toLowerCase()) ||
          therapist.lastName.toLowerCase().includes(query.toLowerCase()) ||
          therapist.specialization.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (specialization) {
      filtered = filtered.filter((therapist) => therapist.specialization === specialization);
    }

    if (language) {
      filtered = filtered.filter((therapist) => therapist.languages.includes(language));
    }

    setFilteredTherapists(filtered);
  };

  const handleBookAppointment = (therapistId: string, therapistName: string) => {
    router.push({
      pathname: '/(app)/(patient)/book-appointment',
      params: { therapistId, therapistName },
    });
  };

  // Get unique specializations and languages for filter options
  const specializations = Array.from(new Set(therapists.map((t) => t.specialization)));
  const languages = Array.from(new Set(therapists.flatMap((t) => t.languages)));

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={cores.desativado} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar terapeuta..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.filterContainer}>
        <FlatList
          data={specializations}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedSpecialization === item ? styles.filterButtonActive : null,
              ]}
              onPress={() => handleSpecializationFilter(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedSpecialization === item ? styles.filterButtonTextActive : null,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
        />
        <FlatList
          data={languages}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedLanguage === item ? styles.filterButtonActive : null,
              ]}
              onPress={() => handleLanguageFilter(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedLanguage === item ? styles.filterButtonTextActive : null,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
        />
      </View>
      <FlatList
        data={filteredTherapists}
        renderItem={({ item }) => (
          <TherapistCard
            therapist={item}
            onBookAppointment={() => handleBookAppointment(item.id, `${item.firstName} ${item.lastName}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.textoBranco,
    margin: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  filterList: {
    paddingVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: cores.desativado,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: cores.primaria,
    elevation: 4,
  },
  filterButtonText: {
    color: cores.textoEscuro,
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: cores.textoBranco,
  },
  listContainer: {
    padding: 15,
  },
});
