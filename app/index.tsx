import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Image,
    Animated,
    Easing,
    ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useRef } from "react";

type Profile = {
    name: string;
    login: string;
    bio: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    location: string;
    html_url: string;
};

export default function Index() {
    const [username, setUsername] = useState("");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    const animateCard = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setProfile(null);

            const response = await fetch(
                `https://api.github.com/users/${username}`
            );

            if (!response.ok) throw new Error("User not found");

            const data = await response.json();
            setProfile(data);

            fadeAnim.setValue(0);
            slideAnim.setValue(40);
            animateCard();
        } catch (error) {
            alert("GitHub user not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="light" style={styles.header}>
                <Text style={styles.text}>Showcase Your GitHub Projects</Text>
            </BlurView>

            <View style={styles.form}>
                <TextInput
                    placeholder="Enter GitHub username"
                    placeholderTextColor="#666"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    style={styles.input}
                />

                <Pressable style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Search</Text>
                </Pressable>

                {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

                {profile && (
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Image
                            source={{ uri: profile.avatar_url }}
                            style={styles.avatar}
                        />

                        <Text style={styles.name}>
                            {profile.name || profile.login}
                        </Text>

                        <Text style={styles.username}>@{profile.login}</Text>

                        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                        <View style={styles.stats}>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{profile.public_repos}</Text>
                                <Text style={styles.statLabel}>Repos</Text>
                            </View>

                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{profile.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>

                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{profile.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>

                        {profile.location && (
                            <Text style={styles.location}>📍 {profile.location}</Text>
                        )}

                        <Text style={styles.link}>{profile.html_url}</Text>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#09b470",
        paddingTop: 80,
    },

    header: {
        paddingHorizontal: 25,
        paddingVertical: 18,
        borderRadius: 40,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
        backgroundColor: "rgba(255,255,255,0.2)",
    },

    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },

    form: {
        marginTop: 40,
        width: "85%",
    },

    input: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 15,
        fontSize: 16,
        marginBottom: 15,
        elevation: 3,
    },

    button: {
        backgroundColor: "#000",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
    },

    card: {
        marginTop: 30,
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        elevation: 8,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 10,
    },

    name: {
        fontSize: 20,
        fontWeight: "bold",
    },

    username: {
        color: "gray",
        marginBottom: 10,
    },

    bio: {
        textAlign: "center",
        marginVertical: 8,
    },

    stats: {
        flexDirection: "row",
        marginTop: 15,
    },

    statBox: {
        alignItems: "center",
        marginHorizontal: 15,
    },

    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
    },

    statLabel: {
        color: "gray",
    },

    location: {
        marginTop: 10,
    },

    link: {
        marginTop: 8,
        color: "#007AFF",
    },
});