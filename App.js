import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default () => {
  React.useEffect(() => {
    const f = async () => { };
    f();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ marginTop: 100 }}>Sandbox</Text>
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

      <Button
        title="Upload"
        onPress={async () => {
          await ImagePicker.requestCameraRollPermissionsAsync();
          const result = await ImagePicker.launchImageLibraryAsync();
          if (!result.cancelled) {
            const uploadResult = await FileSystem.uploadAsync(
              result.uri,
              'http://192.168.31.111:3000/upload',
              {
                headers: {
                  'Content-Type': 'image/png',
                  'custom header': 'DASD',
                },
                httpMethod: FileSystem.FileSystemHttpMethods.PATCH,
                sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
              }
            );

            console.log(uploadResult);
          }
        }}
      />

      <Button
        title="Resumable download"
        onPress={async () => {
          const callback = downloadProgress => {
            const progress =
              downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            console.log(progress);
          };

          const downloadResumable = await FileSystem.createDownloadResumable(
            'http://ipv4.download.thinkbroadband.com/20MB.zip',
            FileSystem.documentDirectory + '20.zip',
            {
              sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
            },
            callback
          );

          try {
            downloadResumable.downloadAsync();
          } catch (e) {
            console.error(e);
          }
          setTimeout(async () => {
            try {
              console.log('pause');
              await downloadResumable.pauseAsync();
              console.log('Paused download operation, saving for future retrieval');
            } catch (e) {
              console.error(e);
            }
            setTimeout(async () => {
              try {
                console.log('resumable');
                const { uri } = await downloadResumable.resumeAsync();
                console.log('Finished downloading to ', uri);
              } catch (e) {
                console.error(e);
              }
            }, 3000);
          }, 1000);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

/* Simple server code in node.js

const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function(req, res) {
  res.send("Index");
  res.end();
});

app.patch("/upload", function(req, res) {
  console.log(JSON.stringify(req.headers));
  res.setHeader("Content-Type", "application/json");
  req.pipe(fs.createWriteStream("./uploads/cos" + Date.now() + ".png"));
  res.end("OK");
});

app.listen(3000, function() {
  console.log("Working on port 3000");
});

*/
