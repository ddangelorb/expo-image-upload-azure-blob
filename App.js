import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'apisauce';
import apiA from './apiA';
import { decode as atob, encode as btoa } from 'base-64'

import React from 'react';
import { StyleSheet, View, ScrollView, Button } from 'react-native';

import colors from "./app/config/colors";

import Form from "./app/components/Form";
import SubmitButton from "./app/components/SubmitButton";
import FormImagePicker from "./app/components/FormImagePicker";

export default () => {

  return (
    <View style={styles.container}>
      <ScrollView style={{ paddingTop: 150 }}>
        <Form
          initialValues={{
            images: []
          }}
          onSubmit={(values) => {
            console.log("Img Submit");
            console.log(values);
            console.log("First Img");
            console.log(values.images[0]);

            let localUri = values.images[0];
            console.log("localUri: " + localUri);
            let filename = localUri.split('/').pop();
            console.log("filename: " + filename);

            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            console.log("type: " + type);

            console.log("Full URL: " + 'https://wpdstorageaccounths.blob.core.windows.net/wpdblob/' + filename);
            const api = create({
              baseURL: 'https://wpdstorageaccounths.blob.core.windows.net',
            });

            //get the current date
            var currentdate = new Date();
            console.log("currentdate: " + currentdate);
            var Curr_date = currentdate.getDay + '-' + currentdate.getMonth + '-' + currentdate.getFullYear;
            console.log("Curr_date: " + Curr_date);

            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
            formData.append('photo', { uri: localUri, name: filename, type });
            var data = btoa(formData);

            const urlApiA = 'https://wpdstorageaccounths.blob.core.windows.net/wpdblob/' + filename;
            //const urlApiA = 'https://wpdstorageaccounths.blob.core.windows.net/wpdblob';
            console.log("urlApiA: " + urlApiA);

            console.log("*** Will now try to send data thru AXIOS! ***");
            apiA.put(urlApiA, data, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                "Access-Control-Allow-Headers": "Origin, Content-Type, x-ms-*",
                "Content-Type": "image/jpg",
                "Content-Length": data.length, //here I am trying to get the size of image.
                "x-ms-date": Curr_date,
                "x-ms-version": "2017-11-09",
                "x-ms-blob-type": "BlockBlob",
              }
            })
              .then(response => { console.log(response); console.log('correct!!'); })
              .catch(error => { console.log(error); console.log('error here!!'); });
            console.log("*** END - data sent thru AXIOS! ***");

            console.log("starting await block");
            //https://github.com/blazerroadg/react-native-azure-blob-storage/blob/master/azurblobstorage.ts

            //https://github.com/watanabeyu/react-native-simple-twitter
            //https://betterprogramming.pub/build-your-very-own-react-component-library-and-publish-it-to-github-package-registry-192a688a51fd
            (async () => {
              console.log("log from async block");
              try {
                let token = '';
                console.log("about to send the response");
                const response = await api.put(
                  '/wpdblob/' + filename,
                  formData,
                  {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                      "Access-Control-Allow-Headers": "Origin, Content-Type, x-ms-*",
                      "Content-Type": "multipart/form-data",
                      "Content-Length": data.length, //here I am trying to get the size of image.
                      "x-ms-date": Curr_date,
                      "x-ms-version": "2017-11-09",
                      "x-ms-blob-type": "BlockBlob"//,
                      //'Authorization': token,
                      //'content-type': 'multipart/form-data',
                      //'x-ms-version': '2017-11-09'
                    }
                  }
                );
                console.log("response sent!");
                console.log("POST response: " + response);
                console.log(response.data)
              }
              catch (error) {
                console.log("error: " + error);
              }
            })()

            /*async () => {
              try {
          let token = '';
        console.log("about to send the response");
        const response = await api.post(
        '/wpdblob',
        formData,
        {
          headers: {
          'Authorization': 'Bearer ' + token,
        'content-type': 'multipart/form-data'
                    }
                  }
        );
        console.log("response sent!");*/

            /*
            let r = await fetch('https://wpdstorageaccounths.blob.core.windows.net', {
          method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token,
        'content-type': 'multipart/form-data',
              },
            });*/
            /*console.log("POST return: " + response);
          }
          catch (error) {
          console.log("error: " + error);
          }
        }*/

            console.log("finishing await block");
          }}
        >
          <FormImagePicker backgroundColor={colors.primary} name="images" />
          <View paddingVertical={24}>
            <SubmitButton title="Send" backgroundColor={colors.primary} />
          </View>
        </Form>
        <Button
          title="Download"
          onPress={async () => {
            const data = await FileSystem.downloadAsync(
              'https://wpdstorageaccounths.blob.core.windows.net/wpdblob/image_test_20211015_104400.png',
              FileSystem.documentDirectory + 'image_test_20211015_104400.png',
              {
                sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
              }
            );

            console.log("download done here!");
            console.log(data);
          }}
        />
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

/*
https://stackoverflow.com/questions/42521679/how-can-i-upload-a-photo-with-expo
https://stackoverflow.com/questions/68865802/formdata-is-not-working-fine-with-expo-cli-react-native
https://github.com/infinitered/apisauce/issues/37
*/
