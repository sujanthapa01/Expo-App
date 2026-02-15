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
    Linking,
    Alert,
    ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useRef } from "react";

// ✅ Match your NestJS DTO
type Profile = {
    name: string;
    login: string;
    bio?: string | null;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    location?: string | null;
    html_url: string;
};

// ⚠ Replace with your machine's LAN IP for Expo
const API_URL = "http://192.168.29.223:3000/api/profile";


export default function Index() {
    const [username, setUsername] = useState("");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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

    // 🔍 Fetch GitHub user
    const handleSearch = async () => {
        if (!username.trim()) return;

        try {
            setLoading(true);
            setProfile(null);

            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error("User not found");

            const data = await response.json();

            // ✅ Map API response to DTO
            const mappedProfile: Profile = {
                name: data.name || data.login,
                login: data.login,
                bio: data.bio,
                avatar_url: data.avatar_url,
                public_repos: data.public_repos,
                followers: data.followers,
                following: data.following,
                location: data.location,
                html_url: data.html_url,
            };

            setProfile(mappedProfile);

            fadeAnim.setValue(0);
            slideAnim.setValue(40);
            animateCard();
        } catch (error) {
            Alert.alert("Error", "GitHub user not found");
        } finally {
            setLoading(false);
        }
    };

    // 💾 Save profile to backend
    const handleSaveProfile = async () => {
        if (!profile) return;
        console.log(profile);

        try {
            setSaving(true);

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to save");

            Alert.alert("Success", "Profile saved successfully 🚀");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BlurView intensity={80} tint="light" style={styles.header}>
                <Text style={styles.headerText}>Showcase Your GitHub Projects</Text>
            </BlurView>

            <View style={styles.form}>
                <TextInput
                    placeholder="Enter GitHub username"
                    placeholderTextColor="#666"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    style={styles.input}
                    onSubmitEditing={handleSearch}
                />

                <Pressable
                    style={[styles.button, !username && { opacity: 0.5 }]}
                    onPress={handleSearch}
                    disabled={!username}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </Pressable>

                {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

                {profile && (
                    <Animated.View
                        style={[
                            styles.card,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />

                        <Text style={styles.name}>{profile.name || profile.login}</Text>

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

                        {profile.location && <Text style={styles.location}>📍 {profile.location}</Text>}

                        <Text
                            style={styles.link}
                            onPress={() => Linking.openURL(profile.html_url)}
                        >
                            View on GitHub
                        </Text>

                        <Pressable
                            style={styles.saveBtn}
                            onPress={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Profile</Text>}
                        </Pressable>
                    </Animated.View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#09b470",
        paddingTop: 80,
        paddingBottom: 40,
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
    headerText: { fontSize: 18, fontWeight: "bold", color: "#000" },
    form: { marginTop: 40, width: "85%" },
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
    buttonText: { color: "white", fontWeight: "bold" },
    card: {
        marginTop: 30,
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        elevation: 8,
    },
    avatar: { width: 110, height: 110, borderRadius: 55, marginBottom: 10 },
    name: { fontSize: 20, fontWeight: "bold" },
    username: { color: "gray", marginBottom: 10 },
    bio: { textAlign: "center", marginVertical: 8 },
    stats: { flexDirection: "row", marginTop: 15 },
    statBox: { alignItems: "center", marginHorizontal: 15 },
    statNumber: { fontSize: 18, fontWeight: "bold" },
    statLabel: { color: "gray" },
    location: { marginTop: 10 },
    link: { marginTop: 8, color: "#007AFF" },
    saveBtn: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 15,
        backgroundColor: "#000",
        alignItems: "center",
    },
    saveBtnText: { color: "#fff", fontWeight: "bold" },
});
