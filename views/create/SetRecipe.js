import React from 'react';
import { View, Button, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useEffect } from 'react';

export default function SetRecipe({ route, navigation }) {
    const STORAGE_KEY = route.params.key;

    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState([]);
    const [edit, setEdit] = useState(route.params.edit);
    let data = { title: "", ingredients: [], description: "", steps: [] };



    useEffect(() => {
        async function getData() {
            try {
                const savedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedData != null) {
                    let newData = JSON.parse(savedData);
                    if (newData.title !== undefined) setTitle(newData.title);
                    if (newData.ingredients !== undefined) setIngredients(newData.ingredients);
                    if (newData.description !== undefined) setDescription(newData.description);
                    if (newData.steps !== undefined) setSteps(newData.steps);
                    navigation.setOptions({ title: title });
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        getData();
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity onPress={() => setEdit(!edit)}><Text>Rediger</Text></TouchableOpacity>)
        });
    }, []);

    useEffect(() => {
        data.title = title;
        data.ingredients = ingredients;
        data.description = description;
        data.steps = steps;
        async function setData() {
            try {
                const jsonData = JSON.stringify(data);
                await AsyncStorage.setItem(STORAGE_KEY, jsonData);
            }
            catch (e) {
                console.error(e);
            }
        }
        setData();
    }, [title, description, ingredients, steps]);

    function AddIngredient() {
        setIngredients([...ingredients, ""]);
    }

    function EditIngredient(text, index) {
        let s = ingredients;
        s[index] = text;
        setIngredients([...s]);
    }

    async function DeleteThis() {
        await AsyncStorage.removeItem(STORAGE_KEY);
        navigation.navigate('Home');
    }

    function EditView() {
        return (
            <View>
                {console.log('render')}
                <TextInput style={styles.title} placeholder='Tittel' onEndEditing={v => setTitle(v.nativeEvent.text)} defaultValue={title} />
                <View style={styles.ingredients}>
                    <Text style={styles.input}>Ingredienser</Text>
                    {ingredients.map((o, i) => {
                        return (<TextInput
                            key={i}
                            style={styles.input}
                            placeholder="Tom ingrediens"
                            onEndEditing={(v) => EditIngredient(v.nativeEvent.text, i)}
                            defaultValue={o}
                        />)
                    })}
                    <TouchableOpacity style={styles.button} onPress={AddIngredient}><Text>Legg til ingrediens</Text></TouchableOpacity>
                </View>
                <TextInput style={styles.input} placeholder='Beskrivelse' onEndEditing={v => setDescription(v.nativeEvent.text)} defaultValue={description} />
                <Button title='Sett første steg' onPress={() => navigation.push('Set Step', { key: STORAGE_KEY, index: 1, edit: true })} />
                <Button title='Slett oppskrift' onPress={DeleteThis} />
            </View>)
    }

    function ShowView() {
        return (
            <View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.ingredients}>
                    <Text style={styles.input}>Ingredienser</Text>
                    {ingredients.map((o, i) => {
                        return (<Text key={i}>{o}</Text>);
                    })}
                </View>
                <Text style={styles.input}>{description}</Text>
                <View>
                    {steps.map((o, i) => {
                        return (<Button key={i} title={"Steg " + (i + 1)} onPress={() => navigation.push('Set Step', { key: STORAGE_KEY, index: i + 1, edit: false })} />)
                    })}
                </View>
            </View>
        )
    }

    return (
        (edit) ? (<EditView />) : (<ShowView />)
    );
}

const styles = StyleSheet.create({
    button: {
        fontSize: 16,
        backgroundColor: 'lightgreen',
        borderWidth: 1,
        padding: 2
    },
    input: {
        fontSize: 22
    },
    ingredients: {
        backgroundColor: 'lightyellow',
        margin: 5
    },
    title: {
        fontSize: 30
    }
})