import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
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
    setSelectedSpecialization(specialization);
    applyFilters(searchQuery, specialization, selectedLanguage);
  };

  const handleLanguageFilter = (language: string) => {
    setSelectedLanguage(language);
    applyFilters(searchQuery, selectedSpecialization, language);
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
        <TouchableOpacity
          style={[styles.filterButton, selectedSpecialization ? styles.filterButtonActive : null]}
          onPress={() => setSelectedSpecialization('')}
        >
          <Text style={styles.filterButtonText}>Especialização</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedLanguage ? styles.filterButtonActive : null]}
          onPress={() => setSelectedLanguage('')}
        >
          <Text style={styles.filterButtonText}>Idioma</Text>
        </TouchableOpacity>
      </View>
      {selectedSpecialization === '' && (
        <FlatList
          data={specializations}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSpecializationFilter(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      )}
      {selectedLanguage === '' && (
        <FlatList
          data={languages}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleLanguageFilter(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: cores.desativado,
  },
  filterButtonActive: {
    backgroundColor: cores.primaria,
  },
  filterButtonText: {
    color: cores.textoBranco,
  },
  filterOption: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: cores.textoBranco,
    borderRadius: 5,
  },
  listContainer: {
    padding: 15,
  },
});