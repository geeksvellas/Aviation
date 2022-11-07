import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from './Loader';
import Feedback from './Feedback';

export default function FlightDetails() {
  const ListRef = useRef();
  const FormRef = useRef();
  const currentPicker = useRef(0);
  const currentDeparture = useRef(0);
  const currentDepart = useRef(0);
  const currentFeedback = useRef(0);
  const currentPostDepart = useRef(0);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const [loading, setloading] = useState(false);
  const [vFeedback, setvFeedback] = useState(false);
  const tabs = [
    {
      id: '1',
      name: 'Flight Preparation',
    },
    {
      id: '2',
      name: 'Pre-Arrival Checklist',
    },
    {
      id: '3',
      name: 'Arrival Services',
    },
    {
      id: '4',
      name: 'Interim Services',
    },
    {
      id: '5',
      name: 'Pre-Departure Checklist',
    },

    {
      id: '6',
      name: 'Departure',
    },
    {
      id: '7',
      name: 'Post-Departure',
    },
  ];

  const [current, setCurrent] = useState('1');
  const [mode, setMode] = useState('time');
  const [modeDeparture, setModeDeparture] = useState('time');
  const [Iservices, setIservices] = useState([]);

  const onAddServices = () => {
    setIservices([...Iservices, {service: null, remarks: null}]);
  };
  const onRemoveService = index => {
    var service = [...Iservices];
    service.splice(index, 1);
    setIservices(service);
  };

  const onSelectTab = (name, id) => {
    setCurrent(id);
    ListRef.current.scrollToIndex({index: id - 1});
    FormRef.current.scrollTo({
      x: 0,
      y: dataSourceCords[id],
      animated: true,
    });
  };

  const onChangeService = (text, index, type) => {
    var service = [...Iservices];
    service[index][type] = text;
    setIservices(service);
  };

  // -------------Flight Preparation functions start ------------

  const [fpreparation, setfpreparation] = useState([
    null,
    null,
    null,
    {value: null, file: []},
    {value: null, file: []},
    {value: null, file: []},
  ]);
  const onPressDocFPreparation = async index => {
    try {
      setloading(true);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      console.log(res);
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then(encoded => {
          console.log(encoded, 'reports.base64');
          setloading(false);
          var tfpreparation = [...fpreparation];
          tfpreparation[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setfpreparation(tfpreparation);
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });

      // }
    } catch (err) {
      setloading(false);
      console.log(JSON.stringify(err), 'Errorss');
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        // throw err;
      }
    }
  };

  const removeFileFP = (arrayIndex, index) => {
    var tfpreparation = [...fpreparation];
    tfpreparation[arrayIndex].file.splice(index, 1);
    setfpreparation(tfpreparation);
  };
  // -------------Flight Preparation end ------------

  // -------------Pre-Arrival functions start ------------

  const [checkList, setChecklist] = useState([
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, file: []},
    {checked: false, remarks: null},
  ]);

  const setChecked = index => {
    var tcheckList = [...checkList];
    tcheckList[index].checked = !tcheckList[index].checked;
    setChecklist(tcheckList);
    // console.log('triggered', tcheckList);
  };
  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    var tcheckList = [...checkList];
    tcheckList[index].remarks = text;
    setChecklist(tcheckList);
    console.log(tcheckList);
    setvFeedback(false);
  };
  const removeFeedback = index => {
    var tcheckList = [...checkList];
    tcheckList[index].remarks = null;
    setChecklist(tcheckList);
  };
  const onPressDocPreA = async index => {
    try {
      setloading(true);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      console.log(res);
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then(encoded => {
          console.log(encoded, 'reports.base64');
          setloading(false);
          var tcheckList = [...checkList];
          tcheckList[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setChecklist(tcheckList);
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });

      // }
    } catch (err) {
      setloading(false);
      console.log(JSON.stringify(err), 'Errorss');
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        // throw err;
      }
    }
  };

  const removeFilePreA = (arrayIndex, index) => {
    var tcheckList = [...checkList];
    tcheckList[arrayIndex].file.splice(index, 1);
    setChecklist(tcheckList);
  };
  // -------------Pre-Arrival functions end ------------

  // -------------Arrival functions start ------------
  const [arrival, setArrival] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false},
    {checked: false},
    null,
    {checked: false},
    null,
    {checked: false},
    null,
    {checked: false},
    null,
    {checked: false},
    null,
    null,
    null,
    {checked: false},
    null,
    null,
    {checked: false},
    {checked: false},
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const setArrivalcheck = index => {
    var tarrival = [...arrival];
    tarrival[index].checked = !tarrival[index].checked;
    setArrival(tarrival);
    // console.log('triggered', tcheckList);
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = (type, index) => {
    currentPicker.current = index;
    setMode(type);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    // console.log("A date has been picked: ",date);
    var tarrival = [...arrival];
    tarrival[currentPicker.current] = tConvert(
      new Date(date).toLocaleTimeString(),
    );
    setArrival(tarrival);
    hideDatePicker();
  };
  const setNow = index => {
    var tarrival = [...arrival];
    tarrival[index] = tConvert(new Date().toLocaleTimeString());
    setArrival(tarrival);
  };

  // -------------Arrival functions End------------

  // -------------Pre-Departure functions start ------------

  const [pdeparturecheck, setpdeparturecheck] = useState([
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isDatePickerVisibleDeparture, setDatePickerVisibilityDeparture] =
    useState(false);
  const showDatePickerDeparture = (type, index) => {
    currentDeparture.current = index;
    setMode(type);
    setDatePickerVisibilityDeparture(true);
  };

  const hideDatePickerDeparture = () => {
    setDatePickerVisibilityDeparture(false);
  };
  const tConvert = time => {
    time = time.split(':');
    return time[0] + ':' + time[1];
  };

  const handleConfirmDeparture = date => {
    // console.log("A date has been picked: ",date);
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[currentDeparture.current] =
      new Date(date).toLocaleDateString() +
      ',' +
      tConvert(new Date(date).toLocaleTimeString());
    setpdeparturecheck(tpdeparturecheck);
    hideDatePickerDeparture();
  };
  const setNowDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index] =
      new Date().toLocaleDateString() +
      ',' +
      tConvert(new Date().toLocaleTimeString());
    setpdeparturecheck(tpdeparturecheck);
  };
  const setCheckedDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].checked = !tpdeparturecheck[index].checked;
    setpdeparturecheck(tpdeparturecheck);
    // console.log('triggered', tcheckList);
  };

  // -------------Pre-Departure functions end ------------

  // -------------Departure functions start ------------

  const [departure, setdeparture] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isDatePickerVisibleDepart, setDatePickerVisibilityDepart] =
    useState(false);
  const showDatePickerDepart = (type, index) => {
    currentDepart.current = index;
    setMode(type);
    setDatePickerVisibilityDepart(true);
  };

  const hideDatePickerDepart = () => {
    setDatePickerVisibilityDepart(false);
  };

  const handleConfirmDepart = date => {
    // console.log("A date has been picked: ",date);
    var tdeparture = [...departure];
    tdeparture[currentDepart.current] =
      new Date(date).toLocaleDateString() +
      ',' +
      tConvert(new Date(date).toLocaleTimeString());
    setdeparture(tdeparture);
    hideDatePickerDeparture();
  };
  const setNowDepart = index => {
    var tdeparture = [...departure];
    tdeparture[index] =
      new Date().toLocaleDateString() +
      ',' +
      tConvert(new Date().toLocaleTimeString());
    setdeparture(tdeparture);
  };
  const setCheckedDepart = index => {
    var tdeparture = [...departure];
    tdeparture[index].checked = !tdeparture[index].checked;
    setdeparture(tdeparture);
    // console.log('triggered', tcheckList);
  };

  // -------------Departure functions end ------------

  // -------------Post Departure functions start ------------

  const [postdeparture, setpostdeparture] = useState([null, null, null]);
  const [isDatePickerVisiblePostDepart, setDatePickerVisibilityPostDepart] =
    useState(false);
  const showDatePickerPostDepart = (type, index) => {
    currentPostDepart.current = index;
    setMode(type);
    setDatePickerVisibilityPostDepart(true);
  };

  const hideDatePickerPostDepart = () => {
    setDatePickerVisibilityPostDepart(false);
  };

  const handleConfirmPostDepart = date => {
    // console.log("A date has been picked: ",date);
    var tpostdeparture = [...postdeparture];
    tpostdeparture[currentDepart.current] =
      new Date(date).toLocaleDateString() +
      ',' +
      tConvert(new Date(date).toLocaleTimeString());
    setpostdeparture(tpostdeparture);
    hideDatePickerPostDepart();
  };
  const setNowPostDepart = index => {
    var tpostdeparture = [...postdeparture];
    tpostdeparture[index] =
      new Date().toLocaleDateString() +
      ',' +
      tConvert(new Date().toLocaleTimeString());
    setpostdeparture(tpostdeparture);
  };

  // -------------Post Departure functions end ------------

  const onScrollList = event => {};
  const ItemRender = ({name, id}) => (
    <TouchableOpacity
      onPress={() => onSelectTab(name, id)}
      style={styleSheet.item}>
      <Text
        style={[
          styleSheet.itemText,
          {color: current == id ? 'green' : 'grey'},
        ]}>
        {name}
      </Text>
      <View
        style={{
          height: 4,
          borderRadius: 10,
          backgroundColor: current == id ? 'green' : 'grey',
          width: '100%',
          marginTop: 10,
        }}></View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styleSheet.MainContainer}>
      <Loader visible={loading} />
      <Feedback
        visible={vFeedback}
        onCloseFeedback={() => setvFeedback(false)}
        onSubmitFeedback={onSubmitFeedback}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styleSheet.titleText}>Edit details</Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <FlatList
          ref={ListRef}
          data={tabs}
          renderItem={({item}) => <ItemRender name={item.name} id={item.id} />}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingHorizontal: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: 20,
        }}>
        <ScrollView ref={FormRef} onScroll={onScrollList}>
          <View
            style={{paddingTop: 30}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['1'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <Text style={styleSheet.title}>Flight Preparation</Text>
            <Text style={styleSheet.label}>Airport Information</Text>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={4}
              value={fpreparation[0]}
              onChangeText={text => {
                var tfpreparation = [...fpreparation];
                tfpreparation[0] = text;
                setfpreparation(tfpreparation);
              }}
            />
            <Text style={styleSheet.label}>NOTAMs</Text>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={4}
              value={fpreparation[1]}
              onChangeText={text => {
                var tfpreparation = [...fpreparation];
                tfpreparation[1] = text;
                setfpreparation(tfpreparation);
              }}
            />
            <Text style={styleSheet.label}>Special Procedures</Text>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={4}
              value={fpreparation[2]}
              onChangeText={text => {
                var tfpreparation = [...fpreparation];
                tfpreparation[2] = text;
                setfpreparation(tfpreparation);
              }}
            />
            <Text style={styleSheet.label}>Slots</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
                value={fpreparation[3].value}
                onChangeText={text => {
                  var tfpreparation = [...fpreparation];
                  tfpreparation[3].value = text;
                  setfpreparation(tfpreparation);
                }}
              />
              <TouchableOpacity onPress={() => onPressDocFPreparation(3)}>
                <Icons
                  style={{color: 'green', marginLeft: 10}}
                  name="upload"
                  size={40}
                />
              </TouchableOpacity>
            </View>

            {fpreparation[3].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {fpreparation[3].file.map((value, index) => {
                  return (
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text>{value.name}</Text>
                      <TouchableOpacity onPress={() => removeFileFP(3, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            <Text style={styleSheet.label}>Parking</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
                value={fpreparation[4].value}
                onChangeText={text => {
                  var tfpreparation = [...fpreparation];
                  tfpreparation[4].value = text;
                  setfpreparation(tfpreparation);
                }}
              />
              <TouchableOpacity onPress={() => onPressDocFPreparation(4)}>
                <Icons
                  style={{color: 'green', marginLeft: 10}}
                  name="upload"
                  size={40}
                />
              </TouchableOpacity>
            </View>
            {fpreparation[4].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {fpreparation[4].file.map((value, index) => {
                  return (
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text>{value.name}</Text>
                      <TouchableOpacity onPress={() => removeFileFP(4, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <Text style={styleSheet.label}>Landing Permit</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
                value={fpreparation[5].value}
                onChangeText={text => {
                  var tfpreparation = [...fpreparation];
                  tfpreparation[5].value = text;
                  setfpreparation(tfpreparation);
                }}
              />
              <TouchableOpacity onPress={() => onPressDocFPreparation(5)}>
                <Icons
                  style={{color: 'green', marginLeft: 10}}
                  name="upload"
                  size={40}
                />
              </TouchableOpacity>
            </View>
            {fpreparation[5].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {fpreparation[5].file.map((value, index) => {
                  return (
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text>{value.name}</Text>
                      <TouchableOpacity onPress={() => removeFileFP(5, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log(fpreparation)}
                style={[styleSheet.button, {marginLeft: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* --------Pre-Arrival checklist -----------  */}
          <View
            style={{paddingTop: 30}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['2'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <Text style={styleSheet.title}>Pre-Arrival Checklist</Text>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(0)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[0].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[0].checked ? 'white' : 'black',
                    },
                  ]}>
                  Crew Entry Requirements
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(0)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[0].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[0].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(0)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(1)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[1].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[1].checked ? 'white' : 'black',
                    },
                  ]}>
                  Pax Entry Requirements
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(1)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[1].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[1].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(1)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(2)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[2].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[2].checked ? 'white' : 'black',
                    },
                  ]}>
                  Crew Transport Arranged
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(2)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[2].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[2].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(2)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(3)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[3].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[3].checked ? 'white' : 'black',
                    },
                  ]}>
                  Pax Transport Arranged
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(3)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[3].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[3].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(3)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(4)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[4].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[4].checked ? 'white' : 'black',
                    },
                  ]}>
                  Informed Recieving Party
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(4)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[4].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[4].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(4)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(5)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[5].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[5].checked ? 'white' : 'black',
                    },
                  ]}>
                  Informed FBO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(5)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[5].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[5].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(5)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(6)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[6].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[6].checked ? 'white' : 'black',
                    },
                  ]}>
                  Informed Handling Agent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(6)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[6].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[6].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(6)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(7)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[7].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[7].checked ? 'white' : 'black',
                    },
                  ]}>
                  Informed Customs & Immigration
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(7)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[7].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[7].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(7)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(8)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[8].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[8].checked ? 'white' : 'black',
                    },
                  ]}>
                  Informed Airport Security
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(8)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[8].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[8].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(8)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(9)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[9].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[9].checked ? 'white' : 'black',
                    },
                  ]}>
                  Informed Catering Company
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(9)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[9].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[9].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(9)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={styleSheet.toggleContainer}>
                <TouchableOpacity
                  onPress={event => setChecked(10)}
                  style={[
                    styleSheet.toggleButton,
                    {
                      backgroundColor: checkList[10].checked
                        ? 'green'
                        : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      styleSheet.label,
                      {
                        textAlign: 'center',
                        color: checkList[10].checked ? 'white' : 'black',
                      },
                    ]}>
                    Prepared Arrival GenDec
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => onPressDocPreA(10)}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {checkList[10].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {checkList[10].file.map((value, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(10, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(11)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[11].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[11].checked ? 'white' : 'black',
                    },
                  ]}>
                  In Position to Receive Aircraft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => getFeedback(11)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {checkList[11].remarks && (
              <View style={{flexDirection: 'row'}}>
                <View style={styleSheet.remarks}>
                  <Text>{checkList[11].remarks}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFeedback(11)}>
                  <Icons
                    style={{marginLeft: 10}}
                    name="delete-circle-outline"
                    color="red"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/* <View style={{flexDirection: 'row', alignItems: 'center',marginVertical:20,justifyContent:"space-between"}}>
               
              <Text style={styleSheet.label}>Upload Arrival GenDec</Text>
              <TouchableOpacity onPress={(event) => setChecked(10)} style={{marginLeft:10,paddingVertical:5,paddingHorizontal:10,borderWidth:1,borderRadius:8}}>
                  <Text style={{color:"green"}}>Upload</Text>
                </TouchableOpacity>
            </View> */}

            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styleSheet.button, {marginLeft: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ---------------------------Arrival   -----------------------*/}
          <View
            style={{paddingVertical: 30}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['3'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <Text style={styleSheet.title}>Arrival</Text>

            <Text style={styleSheet.label}>Movement (AC Landed)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 0)}>
                <Text style={{fontSize: 20}}>
                  {arrival[0] ? arrival[0] : '-- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNow(0)} style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Movement (Chocks in)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 1)}>
                <Text style={{fontSize: 20}}>
                  {arrival[1] ? arrival[1] : '-- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNow(1)} style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Ground Power Unit (GPU):</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Start Time </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 2)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[2] ? arrival[2] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(2)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Stop Time </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 3)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[3] ? arrival[3] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(3)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styleSheet.label}>Number of Pax</Text>
            <TextInput style={styleSheet.input} />
            <Text style={styleSheet.label}>Number of Crew</Text>
            <TextInput style={styleSheet.input} />
            <Text style={styleSheet.label}>Baggage:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Number of Baggage Offloaded</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput style={styleSheet.input} />
                <TouchableOpacity
                  onPress={event => setChecked(10)}
                  style={{
                    marginLeft: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'green'}}>Add photo</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* ---------------------------Pax Movement-----------------------*/}
            <Text style={styleSheet.label}>Pax Movement :</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Pax Departed from Aircraft </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 4)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[4] ? arrival[4] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(4)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Pax Arrived at Terminal</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 5)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[5] ? arrival[5] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(5)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Pax Visa on Arrival</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 6)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[6] ? arrival[6] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(6)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Pax Completed CIQ</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 7)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[7] ? arrival[7] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(7)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Pax Departed from Terminal</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 8)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[8] ? arrival[8] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(8)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(9)}>
                  <Icons
                    name={
                      arrival[9].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[9].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>VOA Not Required</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <TouchableOpacity onPress={event => setArrivalcheck(10)}>
                  <Icons
                    name={
                      arrival[10].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[10].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>
                  Pax Notified on Meeting Point
                </Text>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>

            {/* ---------------------------Catering-----------------------*/}

            <Text style={styleSheet.label}>Catering:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Catering Equipment Offloaded</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styleSheet.label}>
                  Catering Equipment List / Photo
                </Text>
                <TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}>
                    <Text style={{color: 'green'}}>Upload</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Next Catering Order</Text>
                <TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}>
                    <Text style={{color: 'green'}}>Upload</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Catering Delivey Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 11)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[11] ? arrival[11] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(11)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(12)}>
                  <Icons
                    name={
                      arrival[12].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[12].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            <Text style={styleSheet.label}>Water Service:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Completion Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 13)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[13] ? arrival[13] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(13)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(14)}>
                  <Icons
                    name={
                      arrival[14].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[14].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            <Text style={styleSheet.label}>Lavatory Service:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Completion Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 15)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[15] ? arrival[15] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(15)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(16)}>
                  <Icons
                    name={
                      arrival[16].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[16].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            <Text style={styleSheet.label}>Rubbish Service:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Completion Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 17)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[17] ? arrival[17] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(17)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(18)}>
                  <Icons
                    name={
                      arrival[18].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[18].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/* ---------------------------Fuel on Arriva -----------------------*/}

            <Text style={styleSheet.label}>Fuel on Arrival:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Fuel Truck Arrival Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 19)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[19] ? arrival[19] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(19)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Start Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 20)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[20] ? arrival[20] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(20)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>End Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 21)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[21] ? arrival[21] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(21)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Fuel Receipt (signed)</Text>
                <TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}>
                    <Text style={{color: 'green'}}>Upload</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                  value="For remarks; if the fuel truck needs to come around a second time, they can put the details of the second time it comes around into the remarks here"
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(22)}>
                  <Icons
                    name={
                      arrival[22].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[22].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/* ---------------------------Towing Service -----------------------*/}
            <Text style={styleSheet.label}>Towing Service:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Start Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 23)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[23] ? arrival[23] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(23)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>End Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 24)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[24] ? arrival[24] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(24)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Photo (if required)</Text>
                <TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}>
                    <Text style={{color: 'green'}}>Upload</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                  value="Broken Equipment, etc."
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(25)}>
                  <Icons
                    name={
                      arrival[25].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[25].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>

            {/* ---------------------------Overnight Bay-----------------------*/}
            <Text style={styleSheet.label}>Overnight Bay:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Number</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput style={styleSheet.input} />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setArrivalcheck(26)}>
                  <Icons
                    name={
                      arrival[26].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={arrival[26].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>

            {/* ---------------------------Crew Movement	-----------------------*/}

            <Text style={styleSheet.label}>Crew Movement:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Crew Departed from Aircraft</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 27)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[27] ? arrival[27] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(27)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Crew Arrived at Terminal</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 28)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[28] ? arrival[28] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(28)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Crew Visa on Arrival</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 29)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[29] ? arrival[29] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(29)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Crew Completed CIQ</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 30)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[30] ? arrival[30] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(30)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Crew Departed from Terminal</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 31)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[31] ? arrival[31] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(31)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Transport Arrival Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePicker('time', 32)}>
                  <Text style={{fontSize: 20}}>
                    {arrival[32] ? arrival[32] : '-- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNow(32)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Driver Contact Number</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput style={styleSheet.input} />
              </View>
              <Text style={styleSheet.label}>Hotel Name</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput style={styleSheet.input} />
              </View>
              <Text style={styleSheet.label}>Hotel Location</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput style={styleSheet.input} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Map of Route to Hotel</Text>
                <TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}>
                    <Text style={{color: 'green'}}>Upload</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Travel Time (Approximate)</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput style={styleSheet.input} />
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>
            <Text style={styleSheet.label}>Additional Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styleSheet.button, {marginLeft: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------------Interim Services ----------- */}
          <View
            style={{paddingVertical: 10}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['4'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styleSheet.title}>Interim Services</Text>
              <TouchableOpacity
                style={styleSheet.title}
                onPress={onAddServices}>
                <Icons name="plus-box-outline" color="green" size={30} />
              </TouchableOpacity>
            </View>
            {Iservices.length > 0 && (
              <>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.5)',
                    padding: 10,
                    borderRadius: 10,
                    marginVertical: 10,
                  }}>
                  {Iservices.map((val, index) => {
                    return (
                      <View
                        style={{
                          borderBottomWidth: 1,
                          marginVertical: 10,
                          borderBottomColor: 'rgba(0,0,0,0.3)',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={styleSheet.label}>
                            Services Provided
                          </Text>
                          <TouchableOpacity
                            style={styleSheet.label}
                            onPress={() => onRemoveService(index)}>
                            <Icons
                              name="minus-box-outline"
                              color="red"
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TextInput
                            style={styleSheet.input}
                            value={Iservices[index].service}
                            onChangeText={text =>
                              onChangeService(text, index, 'service')
                            }
                          />
                        </View>
                        <Text style={styleSheet.label}>Additional Remarks</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10,
                          }}>
                          <TextInput
                            style={styleSheet.input}
                            multiline={true}
                            numberOfLines={2}
                            value={Iservices[index].remarks}
                            onChangeText={text =>
                              onChangeService(text, index, 'remarks')
                            }
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TouchableOpacity
                    style={[styleSheet.button, {marginRight: 10}]}>
                    <Text style={{color: 'white', textAlign: 'center'}}>
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styleSheet.button, {marginLeft: 10}]}>
                    <Text style={{color: 'white', textAlign: 'center'}}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* ----------------Pre-Departure Checklist ----------- */}
          <View
            style={{paddingVertical: 10}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['5'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <Text style={styleSheet.title}>Pre-Departure Checklist</Text>
            <Text style={styleSheet.label}>Crew Meeting Location</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput style={styleSheet.input} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Photo of Meeting Location</Text>
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Add photos</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Crew Transport Pickup Time</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('datetime', 1)}>
                <Text style={{fontSize: 20}}>
                  {pdeparturecheck[1]
                    ? pdeparturecheck[1]
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(1)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Today</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Confirm Catering Delivery Time</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('datetime', 2)}>
                <Text style={{fontSize: 20}}>
                  {pdeparturecheck[2]
                    ? pdeparturecheck[2]
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(2)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Today</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Fuelling Time</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('datetime', 3)}>
                <Text style={{fontSize: 20}}>
                  {pdeparturecheck[3]
                    ? pdeparturecheck[3]
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(3)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Today</Text>
              </TouchableOpacity>
            </View>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(4)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[4].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[4].checked ? 'white' : 'black',
                    },
                  ]}>
                  Prepared Departure GenDec
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Upload Departure GenDec</Text>
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Add Files</Text>
              </TouchableOpacity>
            </View>
            {/*   ------------------------------Flight Documents/Admin ----------- */}
            <Text style={styleSheet.label}>Flight Documents / Admin:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Flight Documents Received</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 5)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[5] ? pdeparturecheck[5] : 'dd/mm/yy,--:--'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(5)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Flight Documents Printed </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 6)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[6] ? pdeparturecheck[6] : 'dd/mm/yy,--:--'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(6)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Notams Updated </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 7)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[7] ? pdeparturecheck[7] : 'dd/mm/yy,--:--'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(7)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Weather Information Updated </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 8)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[8] ? pdeparturecheck[8] : 'dd/mm/yy,--:--'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(8)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>ATC Flight Plan Filed </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 9)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[9] ? pdeparturecheck[9] : 'dd/mm/yy,--:--'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(9)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Slots Confirmed </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 10)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[10]
                      ? pdeparturecheck[10]
                      : 'dd/mm/yy,--:--'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(10)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/*   ------------------------------Flight Documents/Admin End ----------- */}

            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(11)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[11].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[11].checked ? 'white' : 'black',
                    },
                  ]}>
                  FBO Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(12)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[12].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[12].checked ? 'white' : 'black',
                    },
                  ]}>
                  Handling Agent Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(13)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[13].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[13].checked ? 'white' : 'black',
                    },
                  ]}>
                  CIQ Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(14)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[14].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[14].checked ? 'white' : 'black',
                    },
                  ]}>
                  Airport Security Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(15)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[15].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[15].checked ? 'white' : 'black',
                    },
                  ]}>
                  Catering Agent Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setCheckedDeparture(16)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pdeparturecheck[16].checked
                      ? 'green'
                      : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pdeparturecheck[16].checked ? 'white' : 'black',
                    },
                  ]}>
                  Aircraft Fueller Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons
                  style={{marginLeft: 10}}
                  name="comment-processing-outline"
                  color="green"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            {/*   ------------------------------Transport Operator Reminder	 ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Transport Operator Reminder:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Driver Name</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  value={pdeparturecheck[17]}
                  onChangeText={text => {
                    var tpdeparturecheck = [...pdeparturecheck];
                    tpdeparturecheck[17] = text;
                    setpdeparturecheck(tpdeparturecheck);
                  }}
                />
              </View>
              <Text style={styleSheet.label}>Driver Contact Number</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  value={pdeparturecheck[18]}
                  onChangeText={text => {
                    var tpdeparturecheck = [...pdeparturecheck];
                    tpdeparturecheck[18] = text;
                    setpdeparturecheck(tpdeparturecheck);
                  }}
                />
              </View>
              <Text style={styleSheet.label}>Fuelling Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDeparture('time', 19)}>
                  <Text style={{fontSize: 20}}>
                    {pdeparturecheck[19]
                      ? pdeparturecheck[19]
                      : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDeparture(19)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>
            {/*   ------------------------------Transport Operator Reminder	 End ----------- */}
            <Text style={styleSheet.label}>Additional Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styleSheet.button, {marginLeft: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* -------------------Departure Services----------------- */}
          <View
            style={{paddingVertical: 10}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['6'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <Text style={styleSheet.title}>Departure</Text>
            <Text style={styleSheet.label}>Number of Crew</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={departure[0]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[0] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            {/*   ------------------------------Crew Movement	 ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Crew Movement:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Transport Arrival Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 1)}>
                  <Text style={{fontSize: 20}}>
                    {departure[1] ? departure[1] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(1)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Time Crew Boarded Transport at Hotel
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 2)}>
                  <Text style={{fontSize: 20}}>
                    {departure[2] ? departure[2] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(2)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Map of Route to Hotel</Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'green'}}>Add Photos</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Travel Time (Approximate)</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  value={departure[3]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[3] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <Text style={styleSheet.label}>
                Time Crew Arrived at Terminal
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 4)}>
                  <Text style={{fontSize: 20}}>
                    {departure[4] ? departure[4] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(4)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Flight Documents Handover to Crew
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 5)}>
                  <Text style={{fontSize: 20}}>
                    {departure[5] ? departure[5] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(5)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Time Crew Cleared CIQ</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 6)}>
                  <Text style={{fontSize: 20}}>
                    {departure[6] ? departure[6] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(6)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Time Crew Cleared Airport Security
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 7)}>
                  <Text style={{fontSize: 20}}>
                    {departure[7] ? departure[7] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(7)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Time Crew Boarded Transport to Aircraft
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 8)}>
                  <Text style={{fontSize: 20}}>
                    {departure[8] ? departure[8] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(8)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Time Crew Boarded Aircraft</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 9)}>
                  <Text style={{fontSize: 20}}>
                    {departure[9] ? departure[9] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(9)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/*   ------------------------------Crew Movement	 End ----------- */}

            {/*   ------------------------------Ground Power Unit(GPU) start ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Ground Power Unit(GPU):
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Start Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 10)}>
                  <Text style={{fontSize: 20}}>
                    {departure[10] ? departure[10] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(10)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Stop Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 11)}>
                  <Text style={{fontSize: 20}}>
                    {departure[11] ? departure[11] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(11)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(12)}>
                  <Icons
                    name={
                      departure[12].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[12].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/*   ------------------------------Ground Power Unit(GPU) end ----------- */}

            {/*   ------------------------------Fuel on Departure start ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Fuel on Departure:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Time Fuel Truck Arrived</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 13)}>
                  <Text style={{fontSize: 20}}>
                    {departure[13] ? departure[13] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(13)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Start Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 14)}>
                  <Text style={{fontSize: 20}}>
                    {departure[14] ? departure[14] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(14)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Stop Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 15)}>
                  <Text style={{fontSize: 20}}>
                    {departure[15] ? departure[15] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(15)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Fuel Receipt (signed)</Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'green'}}>Add photos</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(16)}>
                  <Icons
                    name={
                      departure[16].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[16].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/*   ------------------------------Fuel on Departure end ----------- */}

            {/*   ------------------------------Water Service ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Water Service:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Completion Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 17)}>
                  <Text style={{fontSize: 20}}>
                    {departure[17] ? departure[17] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(17)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                  value={departure[18]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[18] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(19)}>
                  <Icons
                    name={
                      departure[19].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[19].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/*   ------------------------------Water Service end ----------- */}

            {/*   ------------------------------Lavatory Service ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Lavatory Service:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Completion Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 20)}>
                  <Text style={{fontSize: 20}}>
                    {departure[20] ? departure[20] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(20)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                  value={departure[21]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[21] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(22)}>
                  <Icons
                    name={
                      departure[22].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[22].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/*   ------------------------------Lavatory Service end ----------- */}

            {/*   ------------------------------Rubbish Service ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Rubbish Service:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Completion Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 23)}>
                  <Text style={{fontSize: 20}}>
                    {departure[23] ? departure[23] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(23)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                  value={departure[24]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[24] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(25)}>
                  <Icons
                    name={
                      departure[25].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[25].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/*   ------------------------------Rubbish Service end ----------- */}

            {/*   ------------------------------Catering ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>Catering:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Catering Equipment Loaded</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  value={departure[26]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[26] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>
                  Catering Equipment List / Photo
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'green'}}>Add photos</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Catering Delivey Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 27)}>
                  <Text style={{fontSize: 20}}>
                    {departure[27] ? departure[27] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(27)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Remarks</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  multiline={true}
                  numberOfLines={2}
                  value={departure[28]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[28] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(29)}>
                  <Icons
                    name={
                      departure[29].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[29].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
            </View>
            {/*   ------------------------------Catering end ----------- */}

            <Text style={styleSheet.label}>Aircraft Ready For Boarding</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 30)}>
                <Text style={{fontSize: 20}}>
                  {departure[30] ? departure[30] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(30)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Number of Pax</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={departure[31]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[31] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            {/*   ------------------------------Baggage ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>Baggage:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Number of Baggage Offloaded</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  value={departure[32]}
                  onChangeText={text => {
                    var tdeparture = [...departure];
                    tdeparture[32] = text;
                    setdeparture(tdeparture);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <Text style={styleSheet.label}>Baggage Photo</Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'green'}}>Add photos</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/*   ------------------------------Baggage end ----------- */}

            {/*   ------------------------------Pax Movement ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Pax Movement:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Pax Pickup Time</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 33)}>
                  <Text style={{fontSize: 20}}>
                    {departure[33] ? departure[33] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(33)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={event => setCheckedDepart(34)}>
                  <Icons
                    name={
                      departure[34].checked
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    color={departure[34].checked ? 'green' : 'black'}
                    size={40}
                  />
                </TouchableOpacity>
                <Text style={styleSheet.label}>Not Required</Text>
              </View>
              <Text style={styleSheet.label}>Pax Arrived at Terminal</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 35)}>
                  <Text style={{fontSize: 20}}>
                    {departure[35] ? departure[35] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(35)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Crew Informed of Pax Arrival and Detailse
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 36)}>
                  <Text style={{fontSize: 20}}>
                    {departure[36] ? departure[36] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(36)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>VAT/GST Refund Completed</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 37)}>
                  <Text style={{fontSize: 20}}>
                    {departure[37] ? departure[37] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(37)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Time Pax Cleared CIQ</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 38)}>
                  <Text style={{fontSize: 20}}>
                    {departure[38] ? departure[38] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(38)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Time Pax Cleared Airport Security
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 39)}>
                  <Text style={{fontSize: 20}}>
                    {departure[39] ? departure[39] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(39)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>
                Time Pax Boarded Transport to Aircraft
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 40)}>
                  <Text style={{fontSize: 20}}>
                    {departure[40] ? departure[40] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(40)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Time Pax Boarded Aircraft</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerDepart('time', 41)}>
                  <Text style={{fontSize: 20}}>
                    {departure[41] ? departure[41] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowDepart(41)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/*   ------------------------------Pax Movement end ----------- */}

            <Text style={styleSheet.label}>Door Close Time</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 42)}>
                <Text style={{fontSize: 20}}>
                  {departure[42] ? departure[42] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(42)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Movement (Chocks Off)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 43)}>
                <Text style={{fontSize: 20}}>
                  {departure[43] ? departure[43] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(43)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Movement (Push Back)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 44)}>
                <Text style={{fontSize: 20}}>
                  {departure[44] ? departure[44] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(44)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Movement (Take Off)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 45)}>
                <Text style={{fontSize: 20}}>
                  {departure[45] ? departure[45] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(45)}
                style={{padding: 10}}>
                <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styleSheet.button, {marginLeft: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------------Post-Departure ----------- */}
          <View
            style={{paddingVertical: 10}}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords['7'] = layout.y;
              setDataSourceCords(dataSourceCords);
            }}>
            <Text style={styleSheet.title}>Post-Departure</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Stamped GenDec</Text>
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Add Photos</Text>
              </TouchableOpacity>
            </View>
            {/*   ------------------------------Services Verified ----------- */}
            <Text style={[styleSheet.label, {marginTop: 10}]}>
              Services Verified:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text style={styleSheet.label}>Time Verified</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styleSheet.picker}
                  onPress={() => showDatePickerPostDepart('time', 0)}>
                  <Text style={{fontSize: 20}}>
                    {postdeparture[0] ? postdeparture[0] : 'dd/mm/yy, -- : --'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNowPostDepart(0)}
                  style={{padding: 10}}>
                  <Text style={{fontSize: 20, color: 'green'}}>Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styleSheet.label}>Name of Verifier</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styleSheet.input}
                  value={postdeparture[1]}
                  onChangeText={text => {
                    var tpostdeparture = [...postdeparture];
                    tpostdeparture[1] = text;
                    setpostdeparture(tpostdeparture);
                  }}
                />
              </View>
            </View>
            {/*   ------------------------------Services Verified end ----------- */}
            <Text style={styleSheet.label}>Additional Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
                value={postdeparture[2]}
                onChangeText={text => {
                  var tpostdeparture = [...postdeparture];
                  tpostdeparture[2] = text;
                  setpostdeparture(tpostdeparture);
                }}
              />
            </View>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
              <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styleSheet.button, {marginLeft: 10}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/*----------------Time picker for Arrival----------------*/}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          is24Hour={true}
        />

        {/*----------------Date Time picker for pre-departure checklist----------------*/}
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDeparture}
          mode={mode}
          onConfirm={handleConfirmDeparture}
          onCancel={hideDatePickerDeparture}
          is24Hour={true}
        />

        {/*----------------Date Time picker for departure ----------------*/}
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDepart}
          mode={mode}
          onConfirm={handleConfirmDepart}
          onCancel={hideDatePickerDepart}
          is24Hour={true}
        />

        {/*----------------Date Time picker for post-departure ----------------*/}
        <DateTimePickerModal
          isVisible={isDatePickerVisiblePostDepart}
          mode={mode}
          onConfirm={handleConfirmPostDepart}
          onCancel={hideDatePickerPostDepart}
          is24Hour={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  checkbox: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
  label: {
    fontSize: 15,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'green',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 12,
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  item: {
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  remarks: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    flex: 1,
  },
});
