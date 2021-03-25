import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { Platform } from 'react-native';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import {
  Container,
  Headers,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProviderListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const [providers, setProviders] = useState<Provider[]>([]);
  const routesParams = route.params as RouteParams; // pego o id do prestador atravex do useRoute
  const [selectProvider, setSelectedProvider] = useState(
    routesParams.providerId,
  );
  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);
  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback(
    (providerId: string) => {
      setSelectedProvider(providerId);
    },
    [setSelectedProvider],
  );

  return (
    <Container>
      <Headers>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Headers>
      <ProviderListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={provider.id === selectProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProviderListContainer>
      <DateTimePicker
        {...(Platform.OS === 'ios' && { textColor: '#f4ede8' })} // < nessa linha
        mode="date"
        display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
        value={new Date()}
      />
    </Container>
  );
};

export default CreateAppointment;
