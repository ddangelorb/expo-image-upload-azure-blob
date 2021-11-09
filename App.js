import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'apisauce';

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

            const api = create({
              baseURL: 'https://<>.blob.core.windows.net',
            });

            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
            formData.append('photo', { uri: localUri, name: filename, type });

            console.log("starting await block");

            (async () => {
              console.log("log from async block");
              try {
                let token = 'g33Vbwphe/6BNoR7PWRucZxHFqRtCyP6WXliLBxSGSSd5pLDXDJzsa5V4CXF+WWZ6qES/1RNgKyjdh9uNs74bQ==';
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
                console.log("response sent!");
                console.log("POST return: " + response);
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
            let r = await fetch('https://<>.blob.core.windows.net', {
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
              'https://<>.blob.core.windows.net/t.png',
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
    </View>
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
