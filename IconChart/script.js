var template_path = Qva.Remote + "?public=only&name=Extensions/IconChart/";

function a_init() {
	// Load the Raphael js library and then draw the extension
	Qva.LoadScript(template_path + "raphael-min.js", qv_draw);
}

function qv_draw() {
	// Add the QlikView extension to the current object
	Qva.AddExtension('IconChart', function(){
		
		// Inputted Values
		rows = this.Layout.Text0.text;
		columns = this.Layout.Text1.text;
		imgURL = this.Layout.Text2.text;
		fill_Direction = this.Layout.Text3.text;
		metric = this.Layout.Text4.text;
			
		// Object Values
		h = this.GetHeight();
		w = this.GetWidth();
		
		// Call div building function
		divID = buildDivFrame(this);
		
		// Determine the image size
		img_dim = determineImageSize(h,w,rows,columns);
		
		// Draw the images
		drawImgs(divID,w,h,rows,columns,metric,img_dim,imgURL,fill_Direction);	
	});
}

function Create2DArray(rows) {
  var arr = [];
  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }
  return arr;
}

function buildDivFrame(obj) {
	// Get window height
	h = obj.GetHeight();
	// Get window width
	w = obj.GetWidth();
	// Get object name
	divID = obj.Name;
	// Build your div
	obj.Element.innerHTML = '<div style="height:' + h + 'px;" id="' + divID +'"></div>';
	return divID;
}

function determineImageSize(h,w,r,c) {
	// Adjust the width we have to work with by giving one pixel of space to each column
	adj_w = w-c;
	// Repeat with the rows
	adj_h = h - r;
	
	// Divide the adjusted dimension length by the number of elements and round down to get the image size
	img_w = Math.floor(adj_w/c);
	
	img_h = Math.floor(adj_h/r);
	
	// Pick the smaller image size so that the icons will fit in both directions
	if (img_w>img_h) {
		img_dim = img_h;
		}
	else {
		img_dim=img_w;
	}
	// Return this calculated image dimension
	return img_dim;
}

function drawImgs(div_id,w,h,row,c,metric,img_dim,activeImgURL,fill_Direction){
	
	//Initialize our page
	var paper = Raphael(div_id, w,h);
	// Initialize an array of images to draw on the screen
	var imgs = Create2DArray(row*c);
	
	// Initialize the number of images drawn
	k=1;
	// Loop through each column
	for (var i = 0;i<c;i++)
	{
		// Fill direction for horizontal
		if(fill_Direction <2) {
			mi = i;
		}
		else{
			mi = c-1-i;
		}
		// Loop through each row
		for (var j=0; j<row;j++)
		{
			// Fill direction for vertical
			if(fill_Direction==0 || fill_Direction==2) {
				mj = j;
			}
			else{
				mj = row-1-j;
			}
			// Calculate the multiplier for the x spacing
			xmulti = mi+1;
			// Calculate the multiplier for the y spacing
			ymulti = mj+1;
			// Calculate the x position
			x = xmulti+mi*img_dim;
			// Calculate the y position
			y = ymulti+mj*img_dim;
			
			// If we haven't filled the metric, draw the image
			if (k<=metric) {
				imgs[i][mj]=paper.image(activeImgURL,x,y,img_dim,img_dim);
				}
			//imgs[i][mj].attr({"clip-rect":x, y,  + " 10 15"});
			// Increment the number drawn
			k++;
		}
		
	}
}

a_init();