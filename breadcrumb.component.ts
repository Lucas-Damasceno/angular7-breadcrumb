import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbArray = [];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.breadcrumbArray = this.createBreadcrumb(this.route)
  }

  createBreadcrumb(obj) {
    let fullPath = '';
    let breadcrumbArray = [{
      label: '',
      path: ''
    }];
    recursivity(obj);
    function recursivity(objParent) {
      if (objParent.url.value[0]) {
        let thisPath;
        if (objParent.url.value[0].path != '') {
          thisPath = '/' + objParent.url.value[0].path;
        }
        let objData;
        objParent.data.subscribe(data => objData = data);
        if (objData.breadcrumb) {
          let newBreadcrumb = {
            label: objData.breadcrumb,
            path: thisPath,
          }
          if (breadcrumbArray[0].label != newBreadcrumb.label) {
            fullPath = thisPath + fullPath;
            breadcrumbArray.unshift(newBreadcrumb)
          }
        }
      }
      if (objParent.parent) {
        recursivity(objParent.parent);
      }
    }
    /* HACK */
    breadcrumbArray.unshift({ label: 'Home', path: '/' })
    breadcrumbArray.pop();
    for (let item of breadcrumbArray) {
      let n = fullPath.indexOf(item.path);
      if (n > 0) {
        let slicedPath = fullPath.slice(0, n);
        item.path = slicedPath + item.path;
      }
    }
    return breadcrumbArray
  }
}
