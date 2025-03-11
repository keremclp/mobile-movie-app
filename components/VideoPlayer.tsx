import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../constants/colors';

interface VideoPlayerProps {
  visible: boolean;
  videoKey: string;
  onClose: () => void;
}

const VideoPlayer = ({ visible, videoKey, onClose }: VideoPlayerProps) => {
  if (!videoKey) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${videoKey}?autoplay=1` }}
            style={styles.video}
            allowsFullscreenVideo
            javaScriptEnabled
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: (Dimensions.get('window').width * 0.9) * (9/16), // 16:9 aspect ratio
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
