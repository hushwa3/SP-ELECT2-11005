import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-files',
  templateUrl: './view-files.page.html',
  styleUrls: ['./view-files.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ViewFilesPage implements OnInit {
  fileList: string[] = [];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.loadFiles();
  }

  async loadFiles() {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents,
      });
      this.fileList = result.files.map(file => file.name);
    } catch (error) {
      console.error('Error loading files', error);
    }
  }

  async confirmDelete(fileName: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${fileName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => this.deleteFile(fileName)
        }
      ]
    });

    await alert.present();
  }

  async deleteFile(fileName: string) {
    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Documents,
      });
      await this.loadFiles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting file', error);
    }
  }
}