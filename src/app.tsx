import React, { useEffect, useState } from 'react';
import { Button, Grid, ImageCard, Select, Text, TextInput } from "@canva/app-ui-kit";
import '../styles/components.css';
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";

export const App = () => {
  const [inviteType, setInviteType] = useState<string>('party_invite');
  const [shape, setShape] = useState<string>('round');
  const [background, setBackground] = useState<string>('gold');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<any[]>([]);

  const [selectedBackgroundId, setBackgroundImageId] = useState<string>('blue1');

  // Fetch background images when the component mounts
  useEffect(() => {
    getBackgroundImages().then((data) => {
      setBackgroundImages(data);
    });
  }, []);

  const getBackgroundImages = async () => {
    const response = await fetch('https://api.kaards.com/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getBackgroundImages',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Ensure the API returns an array of image URLs
    }
    return [];
  };

  const handleInviteTypeChange = (value: string) => {
    setInviteType(value);
  };

  const handleShapeChange = (value: string) => {
    setShape(value);
  };

  const handleBackgroundChange = (value: string) => {
    setBackground(value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomImage(e.target.files[0]);
    }
  };

  const handleCreateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      source: 'magikqr_app',
      platform: 'canva',
      user_id: 'canva user id',
      action: 'generateQRCode',
      whats_it_for: inviteType,
      shape,
      background,
      background_name: selectedBackgroundId,
      user_image_url: customImage ? customImage.name : null,
    };

    try {
      const response = await fetch('https://api.kaards.com/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const base64Data = await convertBlobToBase64(blob);

        const result = await upload({
          type: "IMAGE",
          mimeType: "image/png",
          url: base64Data ? base64Data.toString() : '',
          thumbnailUrl: base64Data ? base64Data.toString() : '',
        });

        await addNativeElement({
          type: "IMAGE",
          ref: result.ref,
        });
      }
    } catch {
      // Handle error
    }
  };

  function convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleBackgroundSelect = (image: any) => {
    console.log(image);
    setBackgroundImageId(image.id); // Set the selected background image URL
  };

  return (
    <div className="app-container">
      <h1>Magikly</h1>
      <h5>Create custom QR codes for your invitations</h5>

      <form>
        <Grid alignX="stretch" alignY="stretch" columns={2} spacing="1u">
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
              { label: "Ring", value: "ring" },
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
          <TextInput type="file" onChange={handleImageUpload} />

          <Text>Background Images</Text>
          <Grid alignX="stretch" alignY="stretch" columns={3} spacing="1u">
            {backgroundImages.map((image) => (
              <ImageCard
                key={image.id}
                thumbnailUrl={image.url}
                onClick={() => handleBackgroundSelect(image)}
                alt="Background"
                selected={selectedBackgroundId === image.id}
                selectable={true}
              />
            ))}
          </Grid>

          <Button variant="primary" onClick={handleCreateQRCode}>Create QR Code</Button>
        </Grid>
      </form>
    </div>
  );
};
