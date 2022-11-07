import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import {
  recognize,
  ScanConfig,
  ScanRegion,
  DLRCharacherResult,
  DLRLineResult,
  DLRResult,
} from 'vision-camera-dynamsoft-label-recognizer';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
const scanRegion: ScanRegion = {
  left: 5,
  top: 40,
  width: 90,
  height: 10,
};
export default function Scanner() {
  const [imageData, setImageData] = useState(undefined);
  const [isActive, setIsActive] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  console.log(device);
  const format = React.useMemo(() => {
    const desiredWidth = 1280;
    const desiredHeight = 720;
    if (device) {
      for (let index = 0; index < device.formats.length; index++) {
        const format = device.formats[index];
        if (format) {
          console.log('h: ' + format.videoHeight);
          console.log('w: ' + format.videoWidth);
          if (
            format.videoWidth == desiredWidth &&
            format.videoHeight == desiredHeight
          ) {
            console.log('select format: ' + format);
            return format;
          }
        }
      }
    }
    return undefined;
  }, [device?.formats]);
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log(status);
      setHasPermission(status === 'authorized');
    })();
    return () => {
      console.log('unmounted');
      setIsActive(false);
    };
  }, []);
  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   if (modalVisibleShared.value === false) {
  //     let config: ScanConfig = {license: ''};

  //     console.log('frame width:' + frame.width);
  //     console.log('frame height:' + frame.height);

  //     config.license =
  //       'DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=='; //public trial
  //     config.scanRegion = scanRegion;
  //     config.includeImageBase64 = true;
  //     config.template =
  //       '{"CharacterModelArray":[{"DirectoryPath":"","Name":"MRZ"}],"LabelRecognizerParameterArray":[{"Name":"default","ReferenceRegionNameArray":["defaultReferenceRegion"],"CharacterModelName":"MRZ","LetterHeightRange":[5,1000,1],"LineStringLengthRange":[30,44],"LineStringRegExPattern":"([ACI][A-Z<][A-Z<]{3}[A-Z0-9<]{9}[0-9][A-Z0-9<]{15}){(30)}|([0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z<]{3}[A-Z0-9<]{11}[0-9]){(30)}|([A-Z<]{0,26}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,26}<{0,26}){(30)}|([ACIV][A-Z<][A-Z<]{3}([A-Z<]{0,27}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,27}){(31)}){(36)}|([A-Z0-9<]{9}[0-9][A-Z<]{3}[0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z0-9<]{8}){(36)}|([PV][A-Z<][A-Z<]{3}([A-Z<]{0,35}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,35}<{0,35}){(39)}){(44)}|([A-Z0-9<]{9}[0-9][A-Z<]{3}[0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z0-9<]{14}[A-Z0-9<]{2}){(44)}","MaxLineCharacterSpacing":130,"TextureDetectionModes":[{"Mode":"TDM_GENERAL_WIDTH_CONCENTRATION","Sensitivity":8}],"Timeout":9999}],"LineSpecificationArray":[{"BinarizationModes":[{"BlockSizeX":30,"BlockSizeY":30,"Mode":"BM_LOCAL_BLOCK","MorphOperation":"Close"}],"LineNumber":"","Name":"defaultTextArea->L0"}],"ReferenceRegionArray":[{"Localization":{"FirstPoint":[0,0],"SecondPoint":[100,0],"ThirdPoint":[100,100],"FourthPoint":[0,100],"MeasuredByPercentage":1,"SourceType":"LST_MANUAL_SPECIFICATION"},"Name":"defaultReferenceRegion","TextAreaNameArray":["defaultTextArea"]}],"TextAreaArray":[{"Name":"defaultTextArea","LineSpecificationNameArray":["defaultTextArea->L0"]}]}';
  //     config.customModelConfig = {
  //       customModelFolder: 'MRZ',
  //       customModelFileNames: ['MRZ'],
  //     };

  //     let scanResult = recognize(frame, config);

  //     let results: DLRResult[] = scanResult.results;
  //     let lineResults: DLRLineResult[] = [];
  //     for (let index = 0; index < results.length; index++) {
  //       const result = results[index];
  //       const lines = result?.lineResults;
  //       if (lines) {
  //         lines.forEach(line => {
  //           lineResults.push(line);
  //         });
  //       }
  //     }

  //     console.log(results);
  //     if (modalVisibleShared.value === false) {
  //       //check is modal visible again since the recognizing process takes time
  //       if (lineResults.length === 2) {
  //         if (scanResult.imageBase64) {
  //           console.log('has image: ');
  //           REA.runOnJS(setImageData)(
  //             'data:image/jpeg;base64,' + scanResult.imageBase64,
  //           );
  //         }
  //         REA.runOnJS(setRecognitionResults)(lineResults);
  //         modalVisibleShared.value = true;
  //         REA.runOnJS(setModalVisible)(true);
  //       }
  //     }
  //   }
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      {device != null && hasPermission && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            format={format}
            isActive={isActive}
            // frameProcessor={frameProcessor}
            frameProcessorFps={1}></Camera>
          {/* <Svg preserveAspectRatio='xMidYMid slice' style={StyleSheet.absoluteFill} viewBox={getViewBox()}>
          <Rect 
            x={scanRegion.left/100*getFrameSize().width}
            y={scanRegion.top/100*getFrameSize().height}
            width={scanRegion.width/100*getFrameSize().width}
            height={scanRegion.height/100*getFrameSize().height}
            strokeWidth="2"
            stroke="red"
          />
          {charactersSVG("char-cropped",getOffsetX(),getOffsetY())}
        </Svg> */}
        </>
      )}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          modalVisibleShared.value = !modalVisible;
          setModalVisible(!modalVisible);
          setRecognitionResults([]);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {renderImage()}
            <MRZResultTable recognitionResults={getLineResults()}/>
            <View style={styles.buttonView}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    Alert.alert("","Copied");
                    Clipboard.setString(getText());
                  }}
                >
                  <Text style={styles.textStyle}>Copy</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    modalVisibleShared.value = !modalVisible;
                    setModalVisible(!modalVisible)
                    setRecognitionResults([]);
                  }}
                >
                  <Text style={styles.textStyle}>Rescan</Text>
                </Pressable>
            </View>

          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonView: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 12,
  },
  lowConfidenceText: {
    color: 'red',
  },
  srcImage: {
    width: Dimensions.get('window').width * 0.7,
    height: 60,
    resizeMode: 'contain',
  },
});
