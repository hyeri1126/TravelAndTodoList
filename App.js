import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './color';
import { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDOS";

export default function App() {
  const [working,setWorking] = useState(true);
  const [text,setText] = useState("");
  const [toDos,setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText=(event)=>{setText(event);}
  const saveToDos = async(toSave) => {
    await AsyncStorage .setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  }
  useEffect(()=>{
    loadToDos();
  },[])
  // console.log(toDos);
  // ToDo 스크린에 추가하는 함수
  const addToDo= async() => {
    if(text===""){
      return;
    }
    //add to do, Date.now는 키값임
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]:{text, working},
    });
    // const newToDos = {...toDos,
    //   [Date.now()]:{text, work:working},
    // }; 
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?",
    [
      {text:"Cancel"},
      {
        text:"Sure", 
        onPress: ()=>{
        const newToDos = {...toDos}; //state의 내용으로 새로운 Object 생성
        delete newToDos[key]; //key가 없는 toDo object
        setToDos(newToDos); //state 업데이트
        saveToDos(newToDos); //AyncStorage에 저장
        },
      },
    ]);
   };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color:working?"white":theme.grey}}>Work</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color:!working?"white":theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        returnKeyType="send"
        style={styles.input} 
        placeholder={working?"Add a To Do":"Where do you want to go?"}>
      </TextInput>
      <ScrollView>
        {Object.keys(toDos).map((key)=>{
          return (
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={()=>deleteToDo(key)}>
                  {/* <Text style={styles.delete}>delete</Text> */}
                  <Fontisto name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : null
           
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    fontSize:38,
    fontWeight:"600",
    color: "white",
  },
  input:{
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginTop:10,
    marginBottom:20,
    fontSize:15,
  },
  toDo:{
   backgroundColor: theme.grey,
   marginBottom:10,
   paddingVertical:10,
   paddingHorizontal:10,
   borderRadius:15,
   flexDirection:"row",
   alignItems:"center",
   justifyContent:"space-between", //요소들을 가능한 양 끝에 정렬
  },
  toDoText:{
    color:"white",
    fontSize:16,
    fontWeight:"500",
  },
  delete:{
    color:"white",
    fontSize:16,
  }
});
