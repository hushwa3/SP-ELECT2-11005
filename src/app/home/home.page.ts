import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  fileName: string = '';
  fileContent: string = '';
  fileList: string[] = [];
  selectedFile: string = '';

  constructor() {}

  ngOnInit() {
    this.refreshFileList();
  }

  async createFile() {
    try {
      if (!this.fileName) {
        alert('Please enter a file name');
        return;
      }
      await Filesystem.writeFile({
        path: this.fileName,
        data: this.fileContent,
        directory: Directory.Documents,
      });
      alert('File created successfully!');
      await this.refreshFileList();
      this.fileName = '';
      this.fileContent = '';
    } catch (error) {
      console.error('Error creating file', error);
      alert('Error creating file');
    }
  }

  async readFile() {
    try {
      if (!this.fileName) {
        alert('Please select a file to read');
        return;
      }

      const contents = await Filesystem.readFile({
        path: this.fileName,
        directory: Directory.Documents,
      });

      if (contents.data instanceof Blob) {
        this.fileContent = await this.handleBlobContent(contents.data);
      } else {
        this.fileContent = contents.data;
      }
      alert('File content loaded!');
    } catch (error) {
      console.error('Error reading file', error);
      alert('Error reading file');
    }
  }

  async deleteFile() {
    try {
      if (!this.fileName) {
        alert('Please select a file to delete');
        return;
      }

      await Filesystem.deleteFile({
        path: this.fileName,
        directory: Directory.Documents,
      });
      alert('File deleted successfully!');
      await this.refreshFileList();
      this.fileName = '';
      this.fileContent = '';
    } catch (error) {
      console.error('Error deleting file', error);
      alert('Error deleting file');
    }
  }

  selectFile(filename: string) {
    this.fileName = filename;
  }

  async refreshFileList() {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents,
      });
      this.fileList = result.files.map(file => file.name);
    } catch (error) {
      console.error('Error reading directory', error);
      alert('Error loading file list');
    }
  }

  async handleBlobContent(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject('Error reading Blob: ' + error);
      };
      reader.readAsText(blob);
    });
  }
}