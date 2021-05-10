import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SetStep({ route, navigation }) {
    const STORAGE_KEY = route.params.key;
    const index = route.params.index;

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState([]);

    const [text, setText] = useState("");
    const [edit, setEdit] = useState(route.params.edit);
    let data = { title: "", ingredients: [], description: "", steps: [] };

    useEffect(() => {
        async function GetData() {
            try {
                let hold = await AsyncStorage.getItem(STORAGE_KEY);
                data = JSON.parse(hold);
                setTitle(data.title);
                setDescription(data.description);
                setIngredients(data.ingredients);
                setSteps(data.steps);
                if (data.steps.length < index) {
                    data.steps.push(text);
                } else {
                    setText(data.steps[index - 1]);
                }
                navigation.setOptions({ title: 'Steg ' + (index) + ' av ' + data.steps.length });
            }
            catch (e) {
                console.error(e);
            }
        }

        GetData();
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity onPress={() => setEdit(!edit)}><Text>Rediger</Text></TouchableOpacity>)
        });
    }, []);

    useEffect(() => {
        async function SendData() {
            data.title = title;
            data.ingredients = ingredients;
            data.description = description;
            data.steps = steps;
            data.steps[index - 1] = text;
            console.log("Steps ", data.steps);
            try {
                const jsonData = JSON.stringify(data);
                await AsyncStorage.setItem(STORAGE_KEY, jsonData);
            }
            catch (e) {
                console.error(e);
            }
        }
        if (text !== undefined && text !== "") SendData();
    }, [text]);

    function EditView() {
        return (
            <View>
                <Text>{index}.</Text>
                <TextInput placeholder='Skriv inn steg' onEndEditing={v => setText(v.nativeEvent.text)} defaultValue={text} />
                <Button title='Nytt steg' onPress={() => navigation.push('Set Step', { key: STORAGE_KEY, index: index + 1, edit: edit })} />
                <Button title='Tilbake' onPress={() => navigation.navigate('New Recipe')} />
            </View>
        )
    }

    function ShowView() {
        return (
            <View>
                <Text>{index}.</Text>
                <Text>{text}</Text>
                {index < steps.length ? <Button title='Neste steg' onPress={() => navigation.push('Set Step', { key: STORAGE_KEY, index: index + 1, edit: edit })} /> : null}
                <Button title='Tilbake' onPress={() => navigation.navigate('New Recipe')} />
            </View>
        )
    }

    return (
        (edit) ? (<EditView />) : (<ShowView />)
    )
}