import React, { useEffect, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { View, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {

    // let allKeys = [];
    const [recipees, setRecipees] = useState([]);
    const [isFocused, setFocus] = useState(false);
    let focus = useIsFocused();

    if (isFocused !== focus) setFocus(focus);

    useEffect(() => {
        if (isFocused) GetAll();
    }, [isFocused]);

    async function GetAll() {
        try {
            let fin = await AsyncStorage.getAllKeys()
            // allKeys = fin;
            let titles = [];
            fin.forEach(async (key, index) => {
                let d = await AsyncStorage.getItem(key);
                let b = JSON.parse(d);
                b.key = key;
                titles.push(b);
                if (index + 1 === fin.length) setRecipees(titles);
            })
            // console.log('Recipees ', recipees);
        }
        catch (e) {
            console.error(e);
            allKeys = [];
        }
    }

    async function DeleteAll() {
        try {
            await AsyncStorage.clear();
            // allKeys = [];
            setRecipees([]);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <View>
            {console.log(recipees)}
            {recipees.map((r) => {
                return (<TouchableOpacity style={styles.recipe} key={r.key} onPress={() =>
                    navigation.navigate('New Recipe', { key: r.key, edit: false })}>
                    <Text style={styles.text}>{r.title}</Text>
                </TouchableOpacity>)
            })}
            <Button title="Lag ny" onPress={() => navigation.navigate('New Recipe', { key: "@" + Date.now(), edit: true })} />
            <Button title="Slett alle" onPress={DeleteAll} />
        </View>
    )
}

const styles = StyleSheet.create({
    recipe: {
        fontSize: 20,
        height: 40,
        backgroundColor: 'lightgrey',
        margin: 4,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        textAlign: 'center'
    }
})