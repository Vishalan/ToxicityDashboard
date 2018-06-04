import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SocketService } from '../../components/socket/socket.service';
import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule}    from '@angular/forms';
import {NodeService} from '../service/nodeservice';
import {Message,TreeNode,MenuItem} from 'primeng/api';
@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent implements OnInit, OnDestroy {
    Http;
    SocketService;
    NodeService;
    awesomeThings = [];
    newThing = '';
    files1: TreeNode[];


    static parameters = [Http, SocketService];
    constructor(private http: Http, private socketService: SocketService, private nodeService: NodeService) {
        this.Http = http;
        this.SocketService = socketService;
        this.NodeService = nodeService;
    }

    ngOnInit() {
        this.NodeService.getFilesystem().then(files => this.files1 = files);
        // return this.Http.get('/api/things')
        //     .map(res => res.json())
        //     // .catch(err => Observable.throw(err.json().error || 'Server error'))
        //     .subscribe(things => {
        //         this.awesomeThings = things;
        //         this.SocketService.syncUpdates('thing', this.awesomeThings);
        //     });
    }


    ngOnDestroy() {
        this.SocketService.unsyncUpdates('thing');
    }

    addThing() {
        if(this.newThing) {
            let text = this.newThing;
            this.newThing = '';

            return this.Http.post('/api/things', { name: text })
                .map(res => res.json())
                .catch(err => Observable.throw(err.json().error || 'Server error'))
                .subscribe(thing => {
                    console.log('Added Thing:', thing);
                });
        }
    }

    deleteThing(thing) {
        return this.Http.delete(`/api/things/${thing._id}`)
            .map(res => res.json())
            .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(() => {
                console.log('Deleted Thing');
            });
    }
}
