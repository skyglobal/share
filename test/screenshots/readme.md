
Server-side Screenshots
==============
[PhantomJS](http://phantomjs.org/) - `npm i -g phantomjs`
[CasperJS](http://casperjs.org/) - `npm i -g casperjs`

## first

`./install.sh`


### maybe :
`brew install wget`
 *  [LibPNG](https://www.underworldproject.org/documentation/LibpngDownload.html)
```
wget http://fossies.org/linux/misc/libpng-1.6.16.tar.gz -O libpng.tar.gz && tar zxvf libpng.tar.gz && cd libpng-1.6.16 && ./configure --prefix=/usr/local && make && make install && cd ../ && rm libpng.tar.gz && rm -rf libpng-1.6.16
```

 * add `export PNG_DIR=/usr/local` to ~/.bash_profile
 * `source ~/.bash_profile`

[Cairo](http://cairographics.org/)
```
wget https://raw.githubusercontent.com/LearnBoost/node-canvas/master/install -O - | sh
```


with problems -
```
brew link freetype --overwrite
brew link libpng --overwrite
```