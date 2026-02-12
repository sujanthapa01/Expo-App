import {View,Text, StyleSheet} from "react-native"

export default function Index () {

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Hii this is my first app</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#272727',
        marginTop:30,
        paddingTop: 40
    },

    text : {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'roboto'
    }
})
