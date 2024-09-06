import type { ChangeEvent, FormEvent } from 'react';
import React, {useState } from 'react';
import { Button, Grid, ImageCard, Select, Text, TextInput } from "@canva/app-ui-kit";
import '../styles/components.css';
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";

export const App = () => {
  // State management using useState and TypeScript
  const [inviteType, setInviteType] = useState<string>('party_invite');
  const [shape, setShape] = useState<string>('round');
  const [background, setBackground] = useState<string>('gold');
  const [customImage, setCustomImage] = useState<File | null>(null);
  
  // Event handlers
  const handleInviteTypeChange = (value: string) => {
    const selectedInviteType = value;
    setInviteType(selectedInviteType);
    //setIsWedding(selectedInviteType === 'wedding_invite');
  };

  const handleShapeChange = (value: string) => {
    setShape(value);
  };

  const handleBackgroundChange = (value: string) => {
    setBackground(value);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomImage(e.target.files[0]);
    }
  };
  
  // Utility function to convert a Blob to a base64 string
  function convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // base64 string
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Converts the Blob to base64 encoded data URL
    });
  }

  // Utility function to convert base64 data URL to a Blob
  function base64ToBlob(base64Data: string, contentType: string): Blob  {
    const byteCharacters = atob(base64Data.split(',')[1]); // Remove the "data:image/png;base64," part
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  // Function to convert base64 data URL to a Blob URL
  function base64ToBlobUrl(base64DataUrl: string): string  {
    // Convert base64 data URL to a Blob
    const contentType = base64DataUrl.split(',')[0].split(':')[1].split(';')[0]; // Extract the content type
    const blob = base64ToBlob(base64DataUrl, contentType);

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  // Form submit handler
  const handleCreateQRCode = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare the data in a JSON object
    const requestData = {
      source: 'magikqr_app',
      platform: 'canva',
      user_id: 'canva user id', // You can replace this with actual user id if available
      action: 'generateQRCode',
      whats_it_for: inviteType,
      shape,
      background,
      user_image_url: customImage ? customImage.name : null, // Assuming customImage is a file, use file name
    };

    try {
      const response = await fetch('https://api.kaards.com/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set header to indicate JSON payload
        },
        body: JSON.stringify(requestData), // Convert requestData to JSON
      });
      if (response.ok) {
        // Assuming this is your base64-encoded PNG data
        const blob = await response.blob();

        const base64Data = await convertBlobToBase64(blob);

        // Create a URL for the blob
        //const objectUrl = URL.createObjectURL(base64ToBlob(base64Data, "image/png"));

        // Upload the image to Canva
        const result = await upload({
          type: "IMAGE",
          mimeType: "image/png", // Set the correct MIME type for PNG images
          url: base64Data ? base64Data.toString() : '', // Convert the base64 data to a string
          thumbnailUrl: base64Data ? base64Data.toString() : '', // You can use the same blob for thumbnail purposes or create another
        });

        // Add the uploaded image to the design
        await addNativeElement({
          type: "IMAGE",
          ref: result.ref,
        });

        // Clean up the URL object after use
        //URL.revokeObjectURL(objectUrl);
      }
    } catch {
      //console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>MagikQR</h1>
      <h5>Create custom QR codes for your invitations</h5>

      <form>
        <Grid alignX="stretch"
        alignY="stretch"
        columns={2}
        spacing="1u">
          <Text>What's it for?</Text>
          <Select
          options={[
            { label: "Party Invite", value: "party_invite" },
            { label: "Wedding Invite", value: "wedding_invite" },
            { label: "Greeting Card", value: "greeting_card" },
          ]}
          value={inviteType}
            onChange={handleInviteTypeChange}
          />

          <Text>Shape</Text>
          <Select
            options={[
              { label: "Round", value: "round" },
              { label: "Balloon", value: "balloon" },
              { label: "Ring", value: "ring" }, // Only for Wedding
              { label: "Heart", value: "heart" },
            ]}
            value={shape}
            onChange={handleShapeChange}
          />

          <Text>Background</Text>
          <Select
            options={[
              { label: "Gold", value: "gold" },
              { label: "Silver", value: "silver" },
              { label: "Blue", value: "blue" },
              { label: "Pink", value: "pink" },
              { label: "Library", value: "library" },
              { label: "Custom", value: "custom" },
            ]}
            value={background}
            onChange={handleBackgroundChange}
          />

          
            <Text>Upload Custom Image</Text>
            <TextInput
              onChange={handleImageUpload}
            />
          
          <Button variant="primary" onClick={handleCreateQRCode}>Create QR Code</Button>
        </Grid>
      </form>
    </div>
  );
};
