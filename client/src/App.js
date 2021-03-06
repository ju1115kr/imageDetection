import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './App.css';

const CLOUDINARY_UPLOAD_URL = 'http://ju1115kr.iptime.org:9009';
const CLOUDINARY_UPLOAD_API_PATH = '/api/v1.0/file'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
      uploadedFileCloudinaryUrl: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL + CLOUDINARY_UPLOAD_API_PATH)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      //console.log(response);
      //console.log(response.body)

      if (response.body !== '') {
        this.setState({
            uploadedFileCloudinaryUrl: CLOUDINARY_UPLOAD_URL  + response.text
        });
        //console.log(this.uploadedFileCloundinaryUrl);
      }
    });
  }

  render() {
    return (
      <form>
        <div className="FileUpload">
          <Dropzone
            onDrop={this.onImageDrop.bind(this)}
            multiple={false}
            accept="image/*">
            <div>Drop an image or click to select a file to upload.</div>
          </Dropzone>
        </div>

        <div>
          {this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <p>{this.state.uploadedFile.name}</p>
            <img src={this.state.uploadedFileCloudinaryUrl} width="50%" height="50%" />
          </div>}
        </div>
      </form>
    )
  }
}
