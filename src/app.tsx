import React, { useEffect, useState, useRef } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Box,
  Button,
  ColorSelector,
  FormField,
  Flyout,
  Grid,
  ImageCard,
  LoadingIndicator,
  Rows,
  NumberInput,
  MultilineInput,
  HorizontalCard,
  CharacterCountDecorator,
  Columns,
  Column,
  Select,
  ArrowRightIcon,
  FontIcon,
  SlidersIcon,
  Text,
  TextInput,
} from "@canva/app-ui-kit";
import { auth } from "@canva/user";
import "../styles/components.css";
import { upload, requestFontSelection } from "@canva/asset";
import { addElementAtPoint } from "@canva/design";

export const App = () => {
  const intl = useIntl();
  const [inviteType, setInviteType] = useState<string>("party_invite");
  const [shape, setShape] = useState<string>("circle");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FF6935");
  const [foregroundColor, setForegroundColor] = useState<string>("#FFFFFF");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<any[]>([]);
  const [fonts, setFonts] = useState<any[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [triggerReferenceElement] = useState<HTMLDivElement | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [backgroundCollection, setBackgroundCollection] = useState<string>("");
  const [fileType, setFileType] = useState("");
  const [topFont, setTopFont] = useState<any>(null);
  const [topFontColor, setTopFontColor] = useState<string>("#000000");
  const [topFontSize, setTopFontSize] = useState<number>(36);
  const [topMessageText, setTopMessageText] = useState<string>(
    "YOU'VE GOT A MESSAGE! 🎉"
  );
  const [isTopFontFilterMenuOpen, setIsTopFontFilterMenuOpen] = useState(false);
  const [bottomFont, setBottomFont] = useState<any>(null);
  const [bottomFontColor, setBottomFontColor] = useState<string>("#000000");
  const [bottomFontSize, setBottomFontSize] = useState<number>(26);
  const [bottomMessageText, setBottomMessageText] = useState<string>(
    "🥳 SCAN WITH YOUR PHONE CAMERA"
  );
  const [isBottomFontFilterMenuOpen, setIsBottomFontFilterMenuOpen] =
    useState(false);

  const handleTopFontChange = (event) => {
    const font = fonts.find((f) => f.family === event);
    setTopFont(font);
  };

  const handleTopFontColorChange = (color) => {
    setTopFontColor(color);
  };

  const handleBottomFontChange = (event) => {
    const font = fonts.find((f) => f.family === event);
    setBottomFont(font);
  };

  const handleBottomFontColorChange = (color) => {
    setBottomFontColor(color);
  };

  const onFilterClick = () => {
    // Toggle the menu
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };
  const onTopFontFilterClick = () => {
    // Toggle the menu
    setIsTopFontFilterMenuOpen(!isTopFontFilterMenuOpen);
  };
  const onBottomFontFilterClick = () => {
    // Toggle the menu
    setIsBottomFontFilterMenuOpen(!isBottomFontFilterMenuOpen);
  };

  const resetFilters = () => {
    setBackgroundCollection("");
    setFileType("");
  };

  const createQRButtonLabel = intl.formatMessage({
    id: "app.button.createQRCode",
    defaultMessage: "Add to Page",
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await auth.getCanvaUserToken();
        setUserToken(token);
        //console.log("User Token retrieved:", token); // Log the token (optional)
      } catch (error) {
        //console.error("Error retrieving Canva user token:", error);
      }
    };

    fetchToken();
  }, []);

  const [selectedBackgroundId, setBackgroundImageId] =
    useState<string>("flowers1");

  useEffect(() => {
    getBackgroundImages().then((data) => {
      setBackgroundImages(data);
    });
  }, []);

  useEffect(() => {
    getFonts().then((data) => {
      setTopFont(data[0]);
      setBottomFont(data[0]);
      setFonts(data);
    });
  }, []);

  useEffect(() => {
    updatePreviewQRCode();
  }, []);

  const getBackgroundImages = async () => {
    const response = await fetch(
      "https://europe-west2-kaards-qr-code.cloudfunctions.net/qrCodeService",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getBackgrounds",
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  };

  const getFonts = async () => {
    const response = await fetch(
      "https://europe-west2-kaards-qr-code.cloudfunctions.net/qrCodeService",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getFonts",
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  };

  const handleInviteTypeChange = (value: string) => {
    setInviteType(value);
    updatePreviewQRCode();
  };

  const handleShapeChange = (value: string) => {
    setShape(value);
    updatePreviewQRCode();
  };

  const handleBackgroundColorChange = (value: string) => {
    setBackgroundColor(value);
  };

  const handleForegroundColorChange = (value: string) => {
    setForegroundColor(value);
  };

  const blobToImageURL = (blob: Blob) => {
    return URL.createObjectURL(blob);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] ?? e;
    if (file) {
      const imageURL = blobToImageURL(file);
      setImageSrc(imageURL);

      // Optional: Revoke the object URL after setting it to avoid memory leaks
      URL.revokeObjectURL(imageURL);
    }
  };

  const handleCreateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      source: "magikqr_app",
      platform: "canva",
      user_id: userToken,
      occasion: inviteType,
      shape,
      background_color: backgroundColor,
      foreground_color: foregroundColor,
      background_name: selectedBackgroundId,
      background_url: customImage ? customImage.name : null,
      font_top: topFont?.family,
      font_color_top: topFontColor,
      font_size_top: topFontSize,
      font_bottom: bottomFont?.family,
      font_color_bottom: bottomFontColor,
      font_size_bottom: bottomFontSize,
      message_top: topMessageText,
      message_bottom: bottomMessageText,
    };

    try {
      const response = await fetch(
        "https://europe-west2-kaards-qr-code.cloudfunctions.net/qrCodeService",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        //console.log("Blob:", blob);
        const base64Data = await convertBlobToBase64(blob);
        //console.log("base64Data:", base64Data);

        const result = await upload({
          type: "image",
          // Handle error
          mimeType: "image/png",
          url: base64Data ? base64Data.toString() : "",
          thumbnailUrl: base64Data ? base64Data.toString() : "",
        });

        await addElementAtPoint({ type: "image", ref: result.ref });
      }
    } catch {}
  };

  const updatePreviewQRCode = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the previous request
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestData = {
      source: "magikqr_app",
      platform: "canva",
      user_id: userToken,
      occasion: inviteType,
      shape,
      background_color: backgroundColor,
      foreground_color: foregroundColor,
      background_name: selectedBackgroundId,
      background_url: customImage ? customImage.name : null,
      font_top: topFont?.family,
      font_color_top: topFontColor,
      font_size_top: topFontSize,
      font_bottom: bottomFont?.family,
      font_color_bottom: bottomFontColor,
      font_size_bottom: bottomFontSize,
      message_top: topMessageText,
      message_bottom: bottomMessageText,
      demo: true,
      format: "png",
    };

    setLoading(true);
    try {
      const response = await fetch(
        "https://europe-west2-kaards-qr-code.cloudfunctions.net/qrCodeService",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        //console.log("Blob:", blob);
        const blobToImageURL = (blob: Blob) => {
          return URL.createObjectURL(blob);
        };
        setPreviewImageSrc(blobToImageURL(blob));
      }
    } catch {
      // Handle error
      setPreviewImageSrc(null);
    } finally {
      setLoading(false);
    }
  };

  function convertBlobToBase64(
    blob: Blob
  ): Promise<string | ArrayBuffer | null> {
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
    setBackgroundColor(image.bg_color);
    setForegroundColor(image.fg_color);
  };

  return (
    <div className="app-container">
      <h5>
        <FormattedMessage
          id="app.title"
          defaultMessage="Creative QR-code stickers to add video messages to your invites and cards"
        />
      </h5>

      <form>
        <Grid alignX="stretch" alignY="stretch" columns={1} spacing="1u">
          {loading ? (
            <LoadingIndicator size="medium" />
          ) : (
            <ImageCard
              key="previewImage"
              thumbnailUrl={previewImageSrc ?? ""}
              selectable={false}
              alt="Preview"
            />
          )}

          <Box paddingEnd="2u">
            <HorizontalCard
              ariaLabel={selectedBackgroundId}
              description={"QR B/g Color: " + backgroundColor + "  F/g Color: " + foregroundColor}
              onClick={onFilterClick}
              title={"Background Image"}
              thumbnail={{ url: backgroundImages.find((bg) => bg.id === selectedBackgroundId)?.thumbnail_url, alt: "Background" }}
            />
          </Box>

          <Flyout
            open={isFilterMenuOpen}
            onRequestClose={() => setIsFilterMenuOpen(false)}
            width="trigger"
            trigger={triggerReferenceElement}
            placement="bottom-center"
            footer={
              <Box padding="2u" background="surface">
                <Columns spacing="1u">
                  <Column>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsFilterMenuOpen(false);
                      }}
                      stretch
                    >
                      Cancel
                    </Button>
                  </Column>
                  <Column>
                    <Button
                      variant="primary"
                      onClick={() => {
                        updatePreviewQRCode();
                        setIsFilterMenuOpen(false);
                      }}
                      stretch
                    >
                      Apply
                    </Button>
                  </Column>
                </Columns>
              </Box>
            }
          >
            <Box padding="2u">
              <Rows spacing="2u">
                <Columns spacing="0.5u">
                  <Column>
                    <Text size="medium" variant="bold">
                      <FormattedMessage
                        id="app.label.backgroundColor"
                        defaultMessage="Background Color"
                      />
                    </Text>
                  </Column>
                  <Column>
                    <Text size="medium" variant="bold">
                      <FormattedMessage
                        id="app.label.foregroundColor"
                        defaultMessage="Foreground Color"
                      />
                    </Text>
                  </Column>
                </Columns>
                <Columns spacing="0.5u">
                  <Column>
                    <ColorSelector
                      id="bgColorSelector"
                      color={backgroundColor}
                      onChange={handleBackgroundColorChange}
                    />
                  </Column>
                  <Column>
                    <ColorSelector
                      id="fgColorSelector"
                      color={foregroundColor}
                      onChange={handleForegroundColorChange}
                    />
                  </Column>
                </Columns>

                <Rows spacing="2u">
                  <Text size="medium" variant="bold">
                    <FormattedMessage
                      id="app.label.backgroundImages"
                      defaultMessage="Background Images"
                    />
                  </Text>
                  <FormField
                    label=""
                    value={backgroundCollection}
                    control={(props) => (
                      <Select
                        {...props}
                        options={[
                          {
                            value: "",
                            label: "All collections",
                          },
                          {
                            value: "christmas",
                            label: "Christmas",
                          },
                          {
                            value: "bauhaus",
                            label: "Bauhaus",
                          },
                          {
                            value: "emoticon",
                            label: "Emoticons",
                          },
                          {
                            value: "blue",
                            label: "Blue",
                          },
                          {
                            value: "party",
                            label: "Party",
                          },
                          {
                            value: "pink",
                            label: "Pink",
                          },
                          {
                            value: "rainbow",
                            label: "Rainbow",
                          },
                          {
                            value: "random",
                            label: "Random",
                          },
                          {
                            value: "tartan",
                            label: "Tartan",
                          },
                          {
                            value: "voucher",
                            label: "Voucher",
                          },
                        ]}
                        onChange={(props) => setBackgroundCollection(props)}
                        placeholder="All collections"
                        stretch
                      />
                    )}
                  />
                  <Box paddingX="1u">
                    <Grid
                      alignX="stretch"
                      alignY="stretch"
                      columns={3}
                      spacing="1u"
                    >
                      {backgroundImages
                        .filter(
                          (img) =>
                            backgroundCollection === "" ||
                            img.type === backgroundCollection
                        )
                        .map((image) => (
                          <ImageCard
                            key={image.id}
                            thumbnailUrl={image.thumbnail_url}
                            onClick={() => handleBackgroundSelect(image)}
                            alt={intl.formatMessage({
                              id: "app.image.alt",
                              defaultMessage: "Background",
                            })}
                            selected={selectedBackgroundId === image.id}
                            selectable={true}
                          />
                        ))}
                    </Grid>
                  </Box>
                </Rows>
              </Rows>
            </Box>
          </Flyout>

          <Box paddingStart="0.5u" paddingEnd="2u">
            <Columns spacing="1u">
              <Column>
                <Text variant="bold">
                  <FormattedMessage
                    id="app.label.topMessage"
                    defaultMessage="Top Message"
                  />
                </Text>
                <MultilineInput
                  footer={<CharacterCountDecorator max={50} />}
                  onChange={(e) => {
                    setTopMessageText(e);
                  }}
                  onBlur={(e) => {
                    updatePreviewQRCode();
                  }}
                  placeholder="Top Message"
                  value={topMessageText}
                />
                <Box paddingEnd="0.5u">
                  <Columns spacing="0.5u">
                    <Column>
                      {topFont?.family ? (
                        <HorizontalCard
                          ariaLabel={topFont.family}
                          description={"Font Size: " + topFontSize + "  Color: " + topFontColor}
                          onClick={onTopFontFilterClick}
                          title={topFont.family}
                          thumbnail={{ url: topFont?.preview_url, alt: "Font" }}
                        />
                      ) : null}
                    </Column>
                  </Columns>
                </Box>
              </Column>
            </Columns>
          </Box>
          <Flyout
            open={isTopFontFilterMenuOpen}
            onRequestClose={() => setIsFilterMenuOpen(false)}
            width="trigger"
            trigger={triggerReferenceElement}
            placement="bottom-center"
            footer={
              <Box padding="2u" background="surface">
                <Columns spacing="1u">
                  <Column>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsTopFontFilterMenuOpen(false);
                      }}
                      stretch
                    >
                      Cancel
                    </Button>
                  </Column>
                  <Column>
                    <Button
                      variant="primary"
                      onClick={() => {
                        updatePreviewQRCode();
                        setIsTopFontFilterMenuOpen(false);
                      }}
                      stretch
                    >
                      Apply
                    </Button>
                  </Column>
                </Columns>
              </Box>
            }
          >
            <Box padding="2u">
              <Rows spacing="2u">
                <Columns spacing="0.5u">
                  <Column>
                    <Text size="medium" variant="bold">
                      <FormattedMessage
                        id="app.label.topFontColor"
                        defaultMessage="Top Message Color"
                      />
                    </Text>
                  </Column>
                </Columns>
                <Columns spacing="0.5u">
                  <Column>
                    <ColorSelector
                      id="topFontColorSelector"
                      color={topFontColor}
                      onChange={handleTopFontColorChange}
                    />
                  </Column>
                </Columns>

                <Columns spacing="0.5u">
                  <Column>
                    <FormField
                      label="Font Size"
                      control={(props) => (
                        <NumberInput
                          defaultValue={36}
                          value={topFontSize}
                          hasSpinButtons={true}
                          step={1}
                          onChange={(e: number) => {
                            if (e > 0) {
                              setTopFontSize(e);
                            }
                            updatePreviewQRCode();
                          }}
                        />
                      )}
                    />
                  </Column>
                </Columns>

                <Rows spacing="2u">
                  <Text size="medium" variant="bold">
                    <FormattedMessage
                      id="app.label.topFont"
                      defaultMessage="Font"
                    />
                  </Text>
                  <Box paddingX="1u">
                    <Grid
                      alignX="stretch"
                      alignY="stretch"
                      columns={3}
                      spacing="1u"
                    >
                      {fonts.map((font) => (
                        <ImageCard
                          key={font.family}
                          thumbnailUrl={font.preview_url}
                          onClick={() => handleTopFontChange(font.family)}
                          alt={intl.formatMessage({
                            id: "app.image.alt",
                            defaultMessage: "Background",
                          })}
                          selected={topFont === font}
                          selectable={true}
                        />
                      ))}
                    </Grid>
                  </Box>
                </Rows>
              </Rows>
            </Box>
          </Flyout>

          <Box paddingStart="0.5u" paddingEnd="2u">
            <Columns spacing="1u">
              <Column>
                <Text variant="bold">
                  <FormattedMessage
                    id="app.label.bottomMessage"
                    defaultMessage="Bottom Message"
                  />
                </Text>
                <MultilineInput
                  footer={<CharacterCountDecorator max={50} />}
                  onChange={(e) => {
                    setBottomMessageText(e);
                  }}
                  onBlur={(e) => {
                    updatePreviewQRCode();
                  }}
                  placeholder="Top Message"
                  value={bottomMessageText}
                />
                <Box paddingEnd="0.5u">
                  <Columns spacing="0.5u">
                    <Column>
                      {bottomFont?.family ? (
                        <HorizontalCard
                          ariaLabel={bottomFont.family}
                          description={"Font Size: " + bottomFontSize + "  Color: " + bottomFontColor}
                          onClick={onBottomFontFilterClick}
                          title={bottomFont.family}
                          thumbnail={{
                            url: bottomFont?.preview_url,
                            alt: "Font",
                          }}
                        />
                      ) : null}
                    </Column>
                  </Columns>
                </Box>
              </Column>
            </Columns>
          </Box>
          <Flyout
            open={isBottomFontFilterMenuOpen}
            onRequestClose={() => setIsFilterMenuOpen(false)}
            width="trigger"
            trigger={triggerReferenceElement}
            placement="bottom-center"
            footer={
              <Box padding="2u" background="surface">
                <Columns spacing="1u">
                  <Column>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsBottomFontFilterMenuOpen(false);
                      }}
                      stretch
                    >
                      Cancel
                    </Button>
                  </Column>
                  <Column>
                    <Button
                      variant="primary"
                      onClick={() => {
                        updatePreviewQRCode();
                        setIsBottomFontFilterMenuOpen(false);
                      }}
                      stretch
                    >
                      Apply
                    </Button>
                  </Column>
                </Columns>
              </Box>
            }
          >
            <Box padding="2u">
              <Rows spacing="2u">
                <Columns spacing="0.5u">
                  <Column>
                    <Text size="medium" variant="bold">
                      <FormattedMessage
                        id="app.label.bottomFontColor"
                        defaultMessage="Bottom Message Color"
                      />
                    </Text>
                  </Column>
                </Columns>
                <Columns spacing="0.5u">
                  <Column>
                    <ColorSelector
                      id="bottomFontColorSelector"
                      color={bottomFontColor}
                      onChange={handleBottomFontColorChange}
                    />
                  </Column>
                </Columns>

                <Columns spacing="0.5u">
                  <Column>
                    <FormField
                      label="Font Size"
                      control={(props) => (
                        <NumberInput
                          defaultValue={26}
                          value={bottomFontSize}
                          hasSpinButtons={true}
                          step={1}
                          onChange={(e: number) => {
                            if (e > 0) {
                              setBottomFontSize(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Column>
                </Columns>

                <Rows spacing="2u">
                  <Text size="medium" variant="bold">
                    <FormattedMessage
                      id="app.label.bottomFont"
                      defaultMessage="Font"
                    />
                  </Text>
                  <Box paddingX="1u">
                    <Grid
                      alignX="stretch"
                      alignY="stretch"
                      columns={3}
                      spacing="1u"
                    >
                      {fonts.map((font) => (
                        <ImageCard
                          key={font.family}
                          thumbnailUrl={font.preview_url}
                          onClick={() => handleBottomFontChange(font.family)}
                          alt={intl.formatMessage({
                            id: "app.image.alt",
                            defaultMessage: "Background",
                          })}
                          selected={topFont === font}
                          selectable={true}
                        />
                      ))}
                    </Grid>
                  </Box>
                </Rows>
              </Rows>
            </Box>
          </Flyout>

          <Box
            paddingStart="1u"
            paddingEnd="2u"
            paddingTop="0.5u"
            paddingBottom="6u"
          >
            <Columns spacing="1u">
              <Column>
                <Button variant="primary" onClick={handleCreateQRCode}>
                  {createQRButtonLabel}
                </Button>
              </Column>
            </Columns>
          </Box>
        </Grid>
      </form>
    </div>
  );
};
