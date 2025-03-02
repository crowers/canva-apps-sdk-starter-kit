import React, { useEffect, useState, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Alert,
  Box,
  Button,
  ColorSelector,
  FormField,
  Flyout,
  Grid,
  ImageCard,
  Rows,
  NumberInput,
  MultilineInput,
  HorizontalCard,
  CharacterCountDecorator,
  Columns,
  Column,
  Select,
  Masonry,
  MasonryItem,
  PlusIcon,
  UndoIcon,
  Text,
  TextInput,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  PlayFilledIcon,
  LinkIcon,
} from "@canva/app-ui-kit";
import { auth } from "@canva/user";
import "../styles/components.css";
import { upload } from "@canva/asset";
import { addElementAtPoint } from "@canva/design";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export const App = () => {
  const defaultFontFamily = "Basic";
  const defaultBackgroundId = "flowers1";
  const defaultBackgroundUrl = "https://kaards.com/images/backgrounds/flowers1.jpg";

  const intl = useIntl();
  const locale = intl.locale;
  const [inviteType] = useState<string>("party_invite");
  const [shape] = useState<string>("circle");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ff6935");
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    useState<string>("#ff6935");
  const [foregroundColor, setForegroundColor] = useState<string>("#ffffff");
  const [currentForegroundColor, setCurrentForegroundColor] =
    useState<string>("#ffffff");
  const [customImage] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<any[]>([]);
  const [fonts, setFonts] = useState<any[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [previewOutOfDate, setPreviewOutOfDate] = useState<boolean>(false);
  const [addingQrCode, setAddingQrCode] = useState<boolean>(false);
  const [showVideoAlert, setShowVideoAlert] = useState<boolean>(false);

  const [triggerReferenceElement] = useState<HTMLDivElement | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [backgroundCollection, setBackgroundCollection] = useState<string>("");
  const [topFont, setTopFont] = useState<any>(null);
  const [topFontColor, setTopFontColor] = useState<string>("#000000");
  const [topFontSize, setTopFontSize] = useState<number>(36);
  const [topMessageText, setTopMessageText] =
    useState<string>("FIND OUT MORE! 😀");
  const [isTopFontFilterMenuOpen, setIsTopFontFilterMenuOpen] = useState(false);
  const [bottomFont, setBottomFont] = useState<any>(null);
  const [bottomFontColor, setBottomFontColor] = useState<string>("#000000");
  const [bottomFontSize, setBottomFontSize] = useState<number>(26);
  const [bottomMessageText, setBottomMessageText] = useState<string>(
    "📲 SCAN WITH YOUR PHONE CAMERA"
  );
  const [isBottomFontFilterMenuOpen, setIsBottomFontFilterMenuOpen] =
    useState(false);
  const [showTopEmojiPicker, setShowTopEmojiPicker] = useState(false);
  const [showBottomEmojiPicker, setShowBottomEmojiPicker] = useState(false);
  
  const [tabId, setSelectedTabId] = useState<string>("linkToUrl");
  const [targetUrl, setTargetUrl] = useState<string>("https://magikcirql.com");

  const [backgroundCollectionOptions, setBackgroundCollectionOptions] = useState<BackgroundOption[]>([]);
  
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

  const createQRButtonLabel = intl.formatMessage({
    id: "app.button.createQRCode",
    defaultMessage: "Add to Page",
  });

  const resetColorsButtonLabel = intl.formatMessage({
    id: "app.button.resetColors",
    defaultMessage: "Reset Colors",
  });

  const applyButtonLabel = intl.formatMessage({
    id: "app.button.apply",
    defaultMessage: "Apply",
  });

  const cancelButtonLabel = intl.formatMessage({
    id: "app.button.cancel",
    defaultMessage: "Cancel",
  });
  
  const backgroundImageLabel = intl.formatMessage({
    id: "app.label.backgroundImage",
    defaultMessage: "Background Image",
  });

  const transparentBackgroundLabel = intl.formatMessage({
    id: "app.label.transparentBackgroundImage",
    defaultMessage: "Transparent Background",
  });

  const noBackgroundLabel = intl.formatMessage({
    id: "app.label.noBackgroundImage",
    defaultMessage: "No Background Image",
  });

  type BackgroundOption = {
    value: string;
    label: string;
  };

  useEffect(() => {
    // This effect now ONLY sets up the options, after intl is available.
    const generateOptions = (): BackgroundOption[] => {
      const options: BackgroundOption[] = [
        { value: "", label: intl.formatMessage({ id: "app.collectionOption.all", defaultMessage: "All collections" }) },
        { value: "bauhaus", label: intl.formatMessage({ id: "app.collectionOption.bauhaus", defaultMessage: "Bauhaus" }) },
        { value: "blue", label: intl.formatMessage({ id: "app.collectionOption.blue", defaultMessage: "Blue" }) },
        { value: "christmas", label: intl.formatMessage({ id: "app.collectionOption.christmas", defaultMessage: "Christmas" }) },
        { value: "emoticon", label: intl.formatMessage({ id: "app.collectionOption.emoticon", defaultMessage: "Emoticons" }) },
        { value: "party", label: intl.formatMessage({ id: "app.collectionOption.party", defaultMessage: "Party" }) },
        { value: "pink", label: intl.formatMessage({ id: "app.collectionOption.pink", defaultMessage: "Pink" }) },
        { value: "rainbow", label: intl.formatMessage({ id: "app.collectionOption.rainbow", defaultMessage: "Rainbow" }) },
        { value: "random", label: intl.formatMessage({ id: "app.collectionOption.random", defaultMessage: "Random" }) },
        { value: "tartan", label: intl.formatMessage({ id: "app.collectionOption.tartan", defaultMessage: "Tartan" }) },
        { value: "voucher", label: intl.formatMessage({ id: "app.collectionOption.voucher", defaultMessage: "Voucher" }) },
      ];

      // Sort options alphabetically by label, keeping "All collections" at the top
      const sorted = [
        options[0],
        ...options.slice(1).sort((a, b) => a.label.localeCompare(b.label)),
      ];
      return sorted;
    }

    if (intl) { // Check if intl is available
      const sortedOptions = generateOptions();
      setBackgroundCollectionOptions(sortedOptions);
    }

  }, [intl]); // intl is a dependency
    
  useEffect(() => {
    setDefaultMessages("linkToUrl");

    const fetchToken = async () => {
      try {
        const token = await auth.getCanvaUserToken();
        setUserToken(token);
        //console.log("User Token retrieved:", token); // Log the token (optional)
      } catch {
        //console.error("Error retrieving Canva user token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (previewOutOfDate) {
      updatePreviewQRCode();
    }
  }, [topMessageText, bottomMessageText]);
  

  const [selectedBackgroundId, setBackgroundImageId] =
    useState<string>(defaultBackgroundId);

  useEffect(() => {
    getBackgroundImages().then((data) => {
      setBackgroundImages([
        {
          id: "none",
          type: "",
          thumbnail_url: "https://kaards.com/images/backgrounds/drawing-mode-behind.png",
          url: "https://kaards.com/images/backgrounds/drawing-mode-behind.png",
          bg_color: "#ffffff",
          fg_color: "#000000",
        },
        {
          id: "transparent",
          type: "",
          thumbnail_url: "https://kaards.com/images/backgrounds/drawing-mode-inside.png",
          url: "https://kaards.com/images/backgrounds/drawing-mode-inside.png",
          bg_color: "#ffffff",
          fg_color: "#000000",
        },
        ...data,
      ]);
    });
  }, []);

  useEffect(() => {
    getFonts().then((data) => {
      setTopFont(data.find((f) => f.family === defaultFontFamily));
      setBottomFont(data.find((f) => f.family === defaultFontFamily));
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

  const handleBackgroundColorSelected = (value: string) => {
    setCurrentBackgroundColor(value);
    setBackgroundColor(currentBackgroundColor);
  };

  const colorPickerClosed = () => {
    setPreviewOutOfDate(true);
  };

  const handleForegroundColorSelected = (value: string) => {
    setCurrentForegroundColor(value);
    setForegroundColor(currentForegroundColor);
  };

  const handleTabSelect = (tabIdIn: string) => {
    setSelectedTabId(tabIdIn);
    setDefaultMessages(tabIdIn);
  };

  const setDefaultMessages =(tabId: string) => {
    // If the top or bottom text has not been customised then update the text based on the tab picked
    const messageUrlTop = intl.formatMessage({ id: "app.message.url.top", defaultMessage: 'FIND OUT MORE! 😀' });
    const messageVideoTop = intl.formatMessage({ id: "app.message.video.top", defaultMessage: "YOU'VE GOT A MESSAGE! 🎉" });
    const messageUrlBottom = intl.formatMessage({ id: "app.message.url.bottom", defaultMessage: '📲 SCAN WITH YOUR PHONE CAMERA' });
    const messageVideoBottom = intl.formatMessage({ id: "app.message.video.bottom", defaultMessage: '🥳 SCAN WITH YOUR PHONE CAMERA' });
  
    const defaultTopMessage = tabId === "linkToUrl" ? messageUrlTop : messageVideoTop;
    const defaultBottomMessage = tabId === "linkToUrl" ? messageUrlBottom : messageVideoBottom;
  
    const updatedTop = topMessageText === messageUrlTop || topMessageText === messageVideoTop;
    const updatedBottom = bottomMessageText === messageUrlBottom || bottomMessageText === messageVideoBottom;
  
    if (updatedTop) setTopMessageText(defaultTopMessage);
    if (updatedBottom) setBottomMessageText(defaultBottomMessage);
  
    if (updatedTop || updatedBottom) {
      setPreviewOutOfDate(true);
    }
  };

  const handleCreateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();

    setAddingQrCode(true);

    const requestData = {
      source: "magikcirql_app",
      brand_name: tabId === "video" ? "magik*moment" : "magik*cirql",
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
      service: tabId === "linkToUrl" ? "url" : "video",
      target_url: tabId === "linkToUrl" ? targetUrl : null,
      locale,
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
          mimeType: "image/png",
          url: base64Data ? base64Data.toString() : "",
          thumbnailUrl: base64Data ? base64Data.toString() : "",
          aiDisclosure: 'none',
        });

        await addElementAtPoint({ type: "image", ref: result.ref, altText: undefined });
        setPreviewOutOfDate(false);
        setAddingQrCode(false);

        if (tabId === "video") {
          setShowVideoAlert(true);
        }
      }
    } catch {
      setAddingQrCode(false);
    }
  };

  const updatePreviewQRCode = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the previous request
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    const requestData = {
      source: "magikcirql_app",
      brand_name: "magik*cirql",
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
      service: tabId === "linkToUrl" ? "url" : "moment",
      format: "png",
      locale,
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
        setPreviewOutOfDate(false);
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

  const showResetQRCodeColors = () => {
    const selectedBackground = backgroundImages.find(
      (bg) => bg.id === selectedBackgroundId
    );
    return (
      backgroundColor !== (selectedBackground?.bg_color ?? "#ffffff") ||
      foregroundColor !== (selectedBackground?.fg_color ?? "#000000")
    );
  };

  const resetQRCodeColors = () => {
    const selectedBackground = backgroundImages.find(
      (bg) => bg.id === selectedBackgroundId
    );
    setBackgroundColor(selectedBackground?.bg_color ?? "#ffffff");
    setForegroundColor(selectedBackground?.fg_color ?? "#000000");
    setPreviewOutOfDate(true);
  };

  const handleBackgroundSelect = (image: any) => {
    setBackgroundImageId(image.id);
    if (image.id !== "none" && image.id !== "transparent") {
      setBackgroundColor(image.bg_color);
      setForegroundColor(image.fg_color);
    }
  };

  const handleTopMessageChange = (e) => {
    setTopMessageText(e);
    setPreviewOutOfDate(true);
  };

  const handleBottomMessageChange = (e) => {
    setBottomMessageText(e);
    setPreviewOutOfDate(true);
  };

  const addEmojiToTop = (emoji) => {
    setTopMessageText(topMessageText + emoji.native);
    setPreviewOutOfDate(true);
    setShowTopEmojiPicker(false); // Close the picker after selection
  };

  const addEmojiToBottom = (emoji) => {
    setBottomMessageText(bottomMessageText + emoji.native);
    setPreviewOutOfDate(true);
    setShowBottomEmojiPicker(false); // Close the picker
  };  

  return (
    <div className="app-container">
      <form>
        <Grid alignX="stretch" alignY="stretch" columns={1} spacing="1u">
          {loading ? (
            <ImageCard
              key="previewImageLoading"
              thumbnailUrl="https://kaards.com/images/backgrounds/skeleton_circle.gif"
              selectable={false}
              alt="Preview"
            />
          ) : previewOutOfDate ? (
            <Box paddingEnd="2u">
              <ImageCard
                key="previewImageLoading"
                thumbnailUrl="https://kaards.com/images/backgrounds/skeleton_circle.png"
                selectable={false}
                alt="Preview"
              />
              <FormattedMessage
                id="app.label.refreshPreview"
                defaultMessage="Refresh Preview"
              >
                {(localizedButton) => (
                  <Button
                    variant="primary"
                    onClick={updatePreviewQRCode}
                    stretch
                  >
                    {String(localizedButton)}
                  </Button>
                )}
              </FormattedMessage>
            </Box>
          ) : (
            <ImageCard
              key="previewImage"
              thumbnailUrl={previewImageSrc ?? ""}
              selectable={false}
              alt="Preview"
            />
          )}

          {!loading && !previewOutOfDate ? (
            <Box
              paddingStart="1u"
              paddingEnd="2u"
              paddingTop="0.5u"
              paddingBottom="2u"
            >
              <Columns spacing="1u">
                <Column>
                  {!addingQrCode ? (
                    <Button
                      variant="primary"
                      onClick={handleCreateQRCode}
                      stretch
                    >
                      {createQRButtonLabel}
                    </Button>
                  ) : (
                    <Button variant="contrast" loading disabled stretch>
                      {createQRButtonLabel}
                    </Button>
                  )}
                </Column>
              </Columns>
            </Box>
          ) : null}
        </Grid>

        <Tabs defaultActiveId="linkToUrl" onSelect={handleTabSelect}>
          <TabList>
            <Tab id="linkToUrl" layout="horizontal" start={<LinkIcon />}>
              <FormattedMessage
                id="app.tab.linkToUrl"
                defaultMessage="Link to URL"
              />
            </Tab>
            <Tab id="video" layout="horizontal" start={<PlayFilledIcon />}>
              <FormattedMessage
                id="app.tab.video"
                defaultMessage="Upload Video"
              />
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel id="linkToUrl">
              <Box paddingStart="0.5u" paddingEnd="2u" paddingTop="2u">
                <Columns spacing="1u">
                  <Column>
                    <Text variant="bold">
                      <FormattedMessage
                        id="app.label.linkToUrl"
                        defaultMessage="URL to link to:"
                      />
                    </Text>
                    <TextInput
                      onChange={(e) => {
                        setTargetUrl(e);
                      }}
                      placeholder="URL"
                      type="url"
                      value={targetUrl}
                    />
                  </Column>
                </Columns>
              </Box>
            </TabPanel>
            <TabPanel id="video">
              <Box paddingTop="2u" paddingEnd="0.5u">
                {showVideoAlert ? (
                  <Alert
                    onDismiss={() => {
                      setShowVideoAlert(false);
                    }}
                    tone="warn"
                  >
                    <FormattedMessage
                      id="app.alert.configureVideo"
                      defaultMessage="Scan the QR Code just added to setup your video"
                    />
                  </Alert>
                ) : (
                  <Text>
                    <FormattedMessage
                      id="app.message.configureVideo"
                      defaultMessage="To upload a video, configure your design then use Add to Page"
                    />
                  </Text>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Grid alignX="stretch" alignY="stretch" columns={1} spacing="1u">
          <Box paddingEnd="2u" paddingTop="3u">
            {selectedBackgroundId != null ? (
                <HorizontalCard
                  ariaLabel={selectedBackgroundId}
                  onClick={onFilterClick}
                  title={
                    <span style={{ fontSize: 14, fontWeight: "bold" }}>
                      {selectedBackgroundId != "none" && selectedBackgroundId != "transparent" ? backgroundImageLabel : (selectedBackgroundId == "none" ? noBackgroundLabel : transparentBackgroundLabel)}
                    </span>
                  }
                  thumbnail={{
                    url: backgroundImages.find(
                      (bg) => bg.id === selectedBackgroundId
                    )?.thumbnail_url ?? defaultBackgroundUrl,
                    alt: String(backgroundImageLabel),
                  }}
                />
            ) : null}
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
                      {cancelButtonLabel}
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
                      {applyButtonLabel}
                    </Button>
                  </Column>
                </Columns>
              </Box>
            }
          >
            <Box padding="2u">
              <Rows spacing="2u">
                <Rows spacing="2u">
                  <Text size="medium" variant="bold">
                    <FormattedMessage
                      id="app.label.backgroundImage"
                      defaultMessage="Background Image"
                    />
                  </Text>
                  <FormField
                    label=""
                    value={backgroundCollection}
                    control={(props) => (
                      <Select
                        {...props}
                        options={backgroundCollectionOptions}
                        onChange={(props) => setBackgroundCollection(props)}
                        placeholder={intl.formatMessage({ id: "app.collectionOption.all", defaultMessage: "All collections" })}
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

          <Box paddingBottom="3u">
            <Rows spacing="0.5u">
              <Text size="medium" variant="bold">
                <FormattedMessage
                  id="app.label.qrCode"
                  defaultMessage="QR Code"
                />
              </Text>

              <Columns spacing="0.5u">
                <Column>
                  <Text size="medium">
                    <FormattedMessage
                      id="app.label.backgroundColor"
                      defaultMessage="Background"
                    />
                  </Text>
                </Column>
                <Column>
                  <Text size="medium">
                    <FormattedMessage
                      id="app.label.foregroundColor"
                      defaultMessage="Foreground"
                    />
                  </Text>
                </Column>
              </Columns>
              <Columns spacing="0.5u">
                <Column>
                  <ColorSelector
                    color={backgroundColor}
                    onChange={handleBackgroundColorSelected}
                    onClose={colorPickerClosed}
                  />
                </Column>
                <Column>
                  <ColorSelector
                    color={foregroundColor}
                    onChange={handleForegroundColorSelected}
                    onClose={colorPickerClosed}
                  />
                </Column>
              </Columns>
            </Rows>
            {showResetQRCodeColors() ? (
              <Box paddingTop="1u">
                <Button
                  ariaLabel="ariaLabel"
                  icon={UndoIcon}
                  size="small"
                  type="button"
                  variant="tertiary"
                  stretch={false}
                  onClick={resetQRCodeColors}
                >
                  {resetColorsButtonLabel}
                </Button>
              </Box>
            ) : null}
          </Box>

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
                  onChange={handleTopMessageChange}
                  placeholder="Top Message"
                  value={topMessageText}
                  maxRows={1}
                />
                <Button 
                  ariaLabel="ariaLabel"
                  variant="tertiary"
                  type="button"
                  size="small"
                  icon={PlusIcon}
                  onClick={() => setShowTopEmojiPicker(!showTopEmojiPicker)} 
                />
                {showTopEmojiPicker && (
                    <Picker
                      data={data} 
                      locale={locale}
                      style={{ position: 'absolute', zIndex: 1000 }}
                      onEmojiSelect={addEmojiToTop}
                    />
                  )}
                <Box paddingEnd="0.5u">
                  <Columns spacing="0.5u">
                    <Column>
                      {topFont?.family ? (
                        <FormattedMessage
                          id="app.label.font"
                          defaultMessage="Font"
                        >
                          {(fontLabel) => (
                            <FormattedMessage
                              id="app.label.fontSize"
                              defaultMessage="Font Size"
                            >
                              {(fontSizeLabel) => (
                                <HorizontalCard
                                  ariaLabel={topFont.family}
                                  description={
                                    <Columns spacing="0.5u">
                                      <Column width="containedContent">
                                        <div
                                          style={{
                                            backgroundColor: topFontColor,
                                          }}
                                        >
                                          ___
                                        </div>
                                      </Column>
                                      <Column>
                                        <span style={{ fontSize: 13 }}>
                                          {fontSizeLabel}: {topFontSize}
                                        </span>
                                      </Column>
                                    </Columns>
                                  }
                                  onClick={onTopFontFilterClick}
                                  title={topFont.family}
                                  thumbnail={{
                                    url: topFont?.preview_url,
                                    alt: String(fontLabel),
                                  }}
                                />
                              )}
                            </FormattedMessage>
                          )}
                        </FormattedMessage>
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
                      {cancelButtonLabel}
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
                      {applyButtonLabel}
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
                      color={topFontColor}
                      onChange={handleTopFontColorChange}
                    />
                  </Column>
                </Columns>

                <Columns spacing="0.5u">
                  <Column>
                    <FormattedMessage
                      id="app.label.fontSize"
                      defaultMessage="Font Size"
                    >
                      {(fontSizeLabel) => (
                        <FormField
                          label={fontSizeLabel}
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
                      )}
                    </FormattedMessage>
                  </Column>
                </Columns>

                <Rows spacing="2u">
                  <Text size="medium" variant="bold">
                    <FormattedMessage
                      id="app.label.topFont"
                      defaultMessage="Font"
                    />
                  </Text>
                  <Box paddingX="1u" style={{ backgroundColor: "white" }}>
                    <Grid columns={1} spacing="1u">
                      <Masonry targetRowHeightPx={80}>
                        {fonts.map((font) => (
                          <MasonryItem
                            key={font.family}
                            targetHeightPx={80}
                            targetWidthPx={200}
                          >
                            <ImageCard
                              thumbnailUrl={font.preview_url}
                              onClick={() => handleTopFontChange(font.family)}
                              alt={intl.formatMessage({
                                id: "app.image.alt",
                                defaultMessage: "Background",
                              })}
                              selected={topFont === font}
                              selectable={true}
                              thumbnailHeight={40}
                              thumbnailAspectRatio={5}
                            />
                          </MasonryItem>
                        ))}
                      </Masonry>
                    </Grid>
                  </Box>
                </Rows>
              </Rows>
            </Box>
          </Flyout>

          <Box paddingStart="0.5u" paddingEnd="2u" paddingBottom="4u">
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
                  onChange={handleBottomMessageChange}
                  placeholder="Bottom Message"
                  value={bottomMessageText}
                  maxRows={1}
                />
                <Button 
                  ariaLabel="ariaLabel"
                  variant="tertiary"
                  type="button"
                  size="small"
                  icon={PlusIcon}
                  onClick={() => setShowBottomEmojiPicker(!showBottomEmojiPicker)}
                />
                {showBottomEmojiPicker && (
                    <Picker 
                      data={data} 
                      locale={locale}
                      style={{ position: 'absolute', zIndex: 1000 }}
                      onEmojiSelect={addEmojiToBottom} 
                    />
                  )}
                <Box paddingEnd="0.5u">
                  <Columns spacing="0.5u">
                    <Column>
                      {bottomFont?.family ? (
                        <FormattedMessage
                          id="app.label.font"
                          defaultMessage="Font"
                        >
                          {(fontLabel) => (
                            <FormattedMessage
                              id="app.label.fontSize"
                              defaultMessage="Font Size"
                            >
                              {(fontSizeLabel) => (
                                <HorizontalCard
                                  ariaLabel={bottomFont.family}
                                  description={
                                    <Columns spacing="0.5u">
                                      <Column width="containedContent">
                                        <div
                                          style={{
                                            backgroundColor: bottomFontColor,
                                          }}
                                        >
                                          ___
                                        </div>
                                      </Column>
                                      <Column>
                                        <span style={{ fontSize: 13 }}>
                                          {fontSizeLabel}: {bottomFontSize}
                                        </span>
                                      </Column>
                                    </Columns>
                                  }
                                  onClick={onBottomFontFilterClick}
                                  title={bottomFont.family}
                                  thumbnail={{
                                    url: bottomFont?.preview_url,
                                    alt: String(fontLabel),
                                  }}
                                />
                              )}
                            </FormattedMessage>
                          )}
                        </FormattedMessage>
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
                      {cancelButtonLabel}
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
                      {applyButtonLabel}
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
                      color={bottomFontColor}
                      onChange={handleBottomFontColorChange}
                    />
                  </Column>
                </Columns>

                <Columns spacing="0.5u">
                  <Column>
                    <FormattedMessage
                      id="app.label.fontSize"
                      defaultMessage="Font Size"
                    >
                      {(fontSizeLabel) => (
                        <FormField
                          label={fontSizeLabel}
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
                      )}
                    </FormattedMessage>
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
                    <Grid columns={1} spacing="1u">
                      <Masonry targetRowHeightPx={80}>
                        {fonts.map((font) => (
                          <MasonryItem
                            key={font.family}
                            targetHeightPx={80}
                            targetWidthPx={200}
                          >
                            <ImageCard
                              key={font.family}
                              thumbnailUrl={font.preview_url}
                              onClick={() =>
                                handleBottomFontChange(font.family)
                              }
                              alt={intl.formatMessage({
                                id: "app.image.alt",
                                defaultMessage: "Background",
                              })}
                              selected={topFont === font}
                              selectable={true}
                              thumbnailHeight={40}
                              thumbnailAspectRatio={5}
                            />
                          </MasonryItem>
                        ))}
                      </Masonry>
                    </Grid>
                  </Box>
                </Rows>
              </Rows>
            </Box>
          </Flyout>
        </Grid>
      </form>
    </div>
  );
};
