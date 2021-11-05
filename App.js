import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

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
          onSubmit={(values) => { console.log(values) }}
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
