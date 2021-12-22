---
  title: 'Entry [1]'
  date: '2021-12-21'
---

I decided to first complete an already started project, before beggining the next one. As such, I've continued my work on a product storage application I've built for a friend of mine. 

The idea of the app is the following: 

* Be able to add products, with the following details: 
    - Name
    - Category, from a drop-down list of alredy added categories
    - Quantity
    - Price
    - Price for Advertising agencies
    - Price for clients. 
    - Supplier name
    - Link to purchase more of the same product
    - Image of the product
* Be able to edit each product
* Be able to mark an amount of the product as BOUGHT or SOLD 
* Display all products in a grid
* Display the history of all product transactions in a separate grid

The frontend is a simple React.js app with TS, RTK for state management and Apollo for the GraphQL client. 

The backend is a Node.js, with Express, TS, Apollo, Type-graphql, TypeORM and MySQL for the database. 

Nothing too complicated. 

I was pondering a lot how to handle the images. I had a couple of options, but at the time, the project I was working on at my job, was about to handle image uploads via Base64 encoding. And I wanted to play around with that, to be better prepared when we started handling image uploads in our application as well. 

Uploadsing images in Base64 wasn't so hard. Everything went smoothly with the rest of the application. We uploaded it on a server and it was working great. 

One thing you should know about Base64 encoded strings - they become **~33%** bigger than the original size. What that meant was that if an image was around **600KB** originally, it became about **1MB**. And that was something that I knew, however didn't account how many images there will be on each server request.

With the fact that not even half of the products have been added and the request was going north of **15MB**, I started looking for solutions. 

First on my list was how to reduce the size of the new images, as that was the root of the problem. I found a couple of options that worked. 

One on the front end and one on the backend. 

On the frontend, I could create a canvas before encoding the file and resizing it to match the sizes I needed.

On the backend, I could decode the base64 string that is sent from the client, resize it either manually or with the help of a library, encode it once again and save it to the database. 

For the new images, it was obvious that the first approach was better. No need for extra encoding/decoding, a cleaner approach. And, that's what I did. After a bit of searching, reading the MDN Docs, etc. I found an article in StackOverflow, with the details I needed and setup the following function: 

    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const MAX_WIDTH = 100;
        const MAX_HEIGHT = 100;
        let { width } = img;
        let { height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
        canvas.width = width;
        canvas.height = height;
        const cnvs = canvas.getContext('2d');
        cnvs.drawImage(img, 0, 0, width, height);
        const dataurl = canvas.toDataURL('image/png');
        setBase64(dataurl);
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);

This gets the uploaded image, loads it in the file reader and resizes it to the provided constraints. Once that's done, convert the image to a base64 string and set it in the local state, ready to upload with the rest of the product data.

And that did it. With this method, I was able to compress the image size and reduce the post request from **1.5MB** to **21KB**, which was quite the improvement.

![Optimizing the image upload process.](/img/image-upload-optimization.png "Image optimization")

Next step was to optimize all of the already uploaded images. No way I'm doing it by hand. That's over 150 images. Off to the drawing board once again. 

I'd like ot use the same method as above. But the File object doens't exist in Node.js so that was that. 

Tested a bit more, searched in StackOverflow again and finally, after a couple of days, I was able to create the following function:

    const resizeImage = async (dataUrl: string, id: string) => {
    if (!dataUrl) {
        return;
    }
    const parts = dataUrl.split(';');
    const mimType = parts[0].split(':')[1];
    const imageData = parts[1].split(',')[1];

    const img = Buffer.from(imageData, 'base64');

    const resizedImageBuffer = await sharp(img).resize(100, 100).toBuffer();
    const resizedImageData = resizedImageBuffer.toString('base64');
    const resizedBase64 = `data:${mimType};base64,${resizedImageData}`;

    await getConnection()
        .createQueryBuilder()
        .update(Product)
        .set({
        productImage: resizedBase64
        })
        .where('productID = :id', { id })
        .execute();
    };

    products.forEach((product) => {
    resizeImage(product.productImage, product.productID);
    });

I combine this with a loop to go thorugh all products in the databse and it was basically done. 

I went down from a **21MB** request, to a **871KB** one.

![Optimizing the image upload process.](/img/server-image-optimization.png "Image optimization for already saved products")

Riding on the dopamine high of finishing this task, I did a bunch of extra stuff to further improve the backend to get it to a state where I like it. It's not perfect at the moment, but it's way better than how it was 2 weeks ago.

Now, I think it's about time to start work on the actual project in mind.
