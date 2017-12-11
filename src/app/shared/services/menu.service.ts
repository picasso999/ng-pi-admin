import { Injectable } from '@angular/core';
import { MENU_INFO } from '../../pages/menu-info';

@Injectable()
export class menuService {

  constructor() {
    this.getNodePath(MENU_INFO);
  }

  private parent_node = null;
  private node = null;
  private path_item = [];

  public queryParentNode(json: any, node_id: any) {
    for (let i = 0; i < json.length; i++) {
      if (this.node) {
        break;
      }
      let obj = json[i];
      if (!obj || !obj.path) {
        continue;
      }
      if (obj.path == node_id) {
        this.node = obj;
        break;
      } else {
        if (obj.children) {
          this.parent_node = obj;
          this.queryParentNode(obj.children, node_id);
        } else {
          continue;
        }
      }
    }
    if (!this.node) {
      this.parent_node = null;
    }
    return {
      parent_node: this.parent_node,
      node: this.node
    };
  }

  public creatRouterLink(nodeId: any) {
    this.node = null;
    this.parent_node = null;
    let obj = this.queryParentNode(MENU_INFO, nodeId);
    if (obj.parent_node && obj.parent_node.path) {
      this.path_item.unshift(obj.parent_node.path);
      return this.creatRouterLink(obj.parent_node.path);
    } else {
      return this.path_item;
    }
  }

  public getNodePath(json: any): void {
    json.forEach((index) => {
      this.path_item = [index.path];
      index.routerLink = this.creatRouterLink(index.path);
      if (index.children) {
        delete index.routerLink;
        this.getNodePath(index.children);
        index.toggle = 'off';
      }
    })
  }

  public putSidebarJson() {
    return MENU_INFO;
  }
}