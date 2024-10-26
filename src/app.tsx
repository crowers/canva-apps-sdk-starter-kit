import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button, Grid, ImageCard, Select, Text, TextInput } from "@canva/app-ui-kit";
import '../styles/components.css';
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";

export const App = () => {
  const intl = useIntl();
  const [inviteType, setInviteType] = useState<string>('party_invite');
  const [shape, setShape] = useState<string>('round');
  const [background, setBackground] = useState<string>('gold');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<any[]>([]);

  const [selectedBackgroundId, setBackgroundImageId] = useState<string>('blue1');

  useEffect(() => {
    getBackgroundImages().then((data) => {
      setBackgroundImages(data);
    });
  }, []);

  const getBackgroundImages = async () => {
    const response = await fetch('https://europe-west2-kaards-qr-code.cloudfunctions.net/qrCodeService', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getBackgrounds',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
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
      whats_it_for: inviteType,
      shape,
      background,
      background_name: selectedBackgroundId,
      user_image_url: customImage ? customImage.name : null,
      demo: false,
    };

    try {
      const response = await fetch('https://europe-west2-kaards-qr-code.cloudfunctions.net/qrCodeService', {
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
    setBackgroundImageId(image.id);
  };

  return (
    <div className="app-container">
      <h5>
        <FormattedMessage id="app.title" defaultMessage="Creative QR-code stickers to add video messages to your invites and cards" />
      </h5>

      <form>
        <Grid alignX="stretch" alignY="stretch" columns={1} spacing="1u">
          <Text>
            <FormattedMessage id="app.label.whatsItFor" defaultMessage="What's it for?" />
          </Text>
          <Select
            options={[
              { label: intl.formatMessage({ id: "app.option.partyInvite", defaultMessage: "Party Invite" }), value: "party_invite" },
              { label: intl.formatMessage({ id: "app.option.weddingInvite", defaultMessage: "Wedding Invite" }), value: "wedding_invite" },
              { label: intl.formatMessage({ id: "app.option.greetingCard", defaultMessage: "Greeting Card" }), value: "greeting_card" },
            ]}
            value={inviteType}
            onChange={handleInviteTypeChange}
          />

          <Text>
            <FormattedMessage id="app.label.shape" defaultMessage="Shape" />
          </Text>
          <Select
            options={[
              { label: intl.formatMessage({ id: "app.option.round", defaultMessage: "Round" }), value: "round" },
              { label: intl.formatMessage({ id: "app.option.balloon", defaultMessage: "Balloon" }), value: "balloon" },
              { label: intl.formatMessage({ id: "app.option.ring", defaultMessage: "Ring" }), value: "ring" },
              { label: intl.formatMessage({ id: "app.option.heart", defaultMessage: "Heart" }), value: "heart" },
            ]}
            value={shape}
            onChange={handleShapeChange}
          />

          <Text>
            <FormattedMessage id="app.label.background" defaultMessage="Background" />
          </Text>
          <Select
            options={[
              { label: intl.formatMessage({ id: "app.option.gold", defaultMessage: "Gold" }), value: "gold" },
              { label: intl.formatMessage({ id: "app.option.silver", defaultMessage: "Silver" }), value: "silver" },
              { label: intl.formatMessage({ id: "app.option.blue", defaultMessage: "Blue" }), value: "blue" },
              { label: intl.formatMessage({ id: "app.option.pink", defaultMessage: "Pink" }), value: "pink" },
              { label: intl.formatMessage({ id: "app.option.library", defaultMessage: "Library" }), value: "library" },
              { label: intl.formatMessage({ id: "app.option.custom", defaultMessage: "Custom" }), value: "custom" },
            ]}
            value={background}
            onChange={handleBackgroundChange}
          />

          <Text>
            <FormattedMessage id="app.label.uploadCustomImage" defaultMessage="Upload Custom Image" />
          </Text>
          <TextInput type="file" onChange={handleImageUpload} />

          <Text>
            <FormattedMessage id="app.label.backgroundImages" defaultMessage="Background Images" />
          </Text>
          <Grid alignX="stretch" alignY="stretch" columns={3} spacing="1u">
            {backgroundImages.map((image) => (
              <ImageCard
                key={image.id}
                thumbnailUrl={image.thumbnail_url}
                onClick={() => handleBackgroundSelect(image)}
                alt={intl.formatMessage({ id: "app.image.alt", defaultMessage: "Background" })}
                selected={selectedBackgroundId === image.id}
                selectable={true}
              />
            ))}
          </Grid>

          <Button variant="primary" onClick={handleCreateQRCode}>
            <FormattedMessage id="app.button.createQRCode" defaultMessage="Create QR Code" />
          </Button>
        </Grid>
      </form>
    </div>
  );
};
