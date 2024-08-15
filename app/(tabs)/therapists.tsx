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
    const filtered = therapists.filter(
      (therapist) =>
        therapist.firstName.toLowerCase().includes(query.toLowerCase()) ||
        therapist.lastName.toLowerCase().includes(query.toLowerCase()) ||
        therapist.specialization.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTherapists(filtered);
  };

  const handleBookAppointment = (therapistId: string, therapistName: string) => {
    router.push({
      pathname: '/(app)/(patient)/book-appointment',
      params: { therapistId, therapistName },
    });
  };

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
  listContainer: {
    padding: 15,
  },
});