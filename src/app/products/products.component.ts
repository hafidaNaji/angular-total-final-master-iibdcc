import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

constructor(private productService:ProductService,
            private router : Router, public appState:AppStateService) {
}
ngOnInit() {
  this.searchProducts();
}

searchProducts(){
 /* this.appState.setProductState({
    status :"LOADING"
  });*/
  this.productService.searchProducts(
    this.appState.productsState.keyword,
    this.appState.productsState.currentPage,
    this.appState.productsState.pageSize)
    .subscribe({
      next: (resp) => {
        //this.appState.productsState.products
        let products=resp.body as Product[];
        let totalProducts :number=parseInt( resp.headers.get('x-total-count')!);
        //this.appState.productsState.totalProducts=totalProducts;
        //this.appState.productsState.totalPages=
         let totalPages=
          Math.floor(totalProducts/this.appState.productsState.pageSize);
        //console.log(this.totalPages);
        if(totalProducts % this.appState.productsState.pageSize !=0 ){
          ++totalPages;//this.appState.productsState.totalPages;//=this.totalPages+1;
        }
        this.appState.setProductState({
          products : products,
          totalProducts : totalProducts,
          totalPages : totalPages,
          status :"LOADED"
        })
      },
      error : err => {
        this.appState.setProductState({
          status : "ERROR",
          errorMessage:err
        })
      }
    })

 // this.products=this.productService.getProduct();
}
  handelCheckProduct(product:Product) {
  this.productService.checkProduct(product).subscribe({
    next :updateProduct => {
      product.checked=!product.checked;
     // this.getProduct();
    }
  })

  }

  handelDelete(product: Product) {
  if(confirm("Etes vous sure?"))
  this.productService.deleteProduct(product).subscribe({
    next : value => {
      //this.getProducts
      //this.searchProducts();
      //this.appState.productsState.products=
      // this.appState.productsState.products.filter((p:any)=>p.id!=product.id);
      this.searchProducts();
    }
  })

  }
/*
  searchProduct() {
  this.currentPage=1;
  this.totalPages=0;
   this.productService.searchProducts(this.keyword,this.currentPage,this.pageSize).subscribe({
     next :value =>{
       this.products=value;
     }
   })
  }*/

  handelGoToPage(page: number) {
  this.appState.productsState.currentPage=page;
  this.searchProducts();

  }

  handelEdit(product: Product) {
    this.router.navigateByUrl(`/admin/editProduct/${product.id}`)

  }
}
