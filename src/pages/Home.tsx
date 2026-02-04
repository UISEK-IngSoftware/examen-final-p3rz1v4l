import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Character {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  image: string;
}

const Home: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_URL =
    "https://futuramaapi.com/api/characters?orderBy=id&orderByDirection=asc&page=1&size=50";

  const mainCharactersNames = [
    "Philip J. Fry",
    "Turanga Leela",
    "Bender Bending Rodríguez",
    "Professor Hubert J. Farnsworth",
    "Amy Wong",
    "Hermes Conrad",
    "Dr. John A. Zoidberg",
    "Nibbler",
  ];

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(API_URL);
        const allCharacters: Character[] = response.data.items;

        const mainCharacters = allCharacters.filter((character) =>
          mainCharactersNames.includes(character.name)
        );

        const secondaryCharacters = allCharacters.filter(
          (character) => !mainCharactersNames.includes(character.name)
        );

        setCharacters([...mainCharacters, ...secondaryCharacters]);
      } catch (error) {
        setError("No se pudo cargar la información de los personajes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Personajes de Futurama</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Cargando personajes..." />

        {error && (
          <IonText color="danger">
            <p className="ion-text-center">{error}</p>
          </IonText>
        )}

        {!loading && characters.length === 0 && !error && (
          <IonText>
            <p className="ion-text-center">
              No existen personajes para mostrar.
            </p>
          </IonText>
        )}

        {characters.map((character) => (
          <IonCard key={character.id}>
            <IonCardContent>
              <IonItem lines="none">
                <IonAvatar slot="start" style={{ width: "70px", height: "70px" }}>
                  <img src={character.image} alt={character.name} />
                </IonAvatar>

                <IonLabel>
                  <h2 style={{ fontWeight: "bold" }}>{character.name}</h2>
                  <p>Especie: {character.species}</p>
                  <p>Género: {character.gender}</p>
                  <p>
                    Estado:{" "}
                    <IonText
                      color={
                        character.status === "ALIVE"
                          ? "success"
                          : character.status === "DEAD"
                          ? "danger"
                          : "medium"
                      }
                    >
                      {character.status}
                    </IonText>
                  </p>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
