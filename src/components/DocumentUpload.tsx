import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  FileImage,
  FileText,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  API_CONFIG,
  getApiUrl,
  getAuthHeaders,
  getAuthHeadersForFormData,
} from "@/lib/config";

interface DocumentUploadProps {
  eventId: string;
  participantId: string;
  onUploadSuccess?: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  participantId,
  onUploadSuccess,
}) => {
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null);
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [participantName, setParticipantName] = useState<string>("");
  const [isLoadingParticipant, setIsLoadingParticipant] = useState(true);

  const frontIdInputRef = useRef<HTMLInputElement>(null);
  const backIdInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch participant details on component mount
  useEffect(() => {
    const fetchParticipantDetails = async () => {
      if (!participantId) return;

      console.log({ participantId });

      try {
        setIsLoadingParticipant(true);
        const url = getApiUrl(
          API_CONFIG.ENDPOINTS.PARTICIPANTS.GET_BY_ID(participantId)
        );
        const response = await axios.get(url, {
          headers: getAuthHeaders(),
        });

        console.log("Participant API Response:", response.data);

        if (response.data && response.data.status === "success") {
          const participantData = Array.isArray(response.data.data)
            ? response.data.data[0]
            : response.data.data;

          console.log("Participant Data:", participantData);

          if (participantData && participantData.name) {
            setParticipantName(participantData.name);
          }
        }
      } catch (err: any) {
        console.error("Error fetching participant details:", err);

        // Log detailed error information
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
          console.error("Response headers:", err.response.headers);
        }

        // Don't set error state or show toast - just log it
        // The user can still upload documents even if name fetch fails
      } finally {
        setIsLoadingParticipant(false);
      }
    };

    fetchParticipantDetails();
  }, [participantId]);

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (images or PDF)
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      if (!isValidType) {
        setError(
          "Please upload an image file (PNG, JPG, JPEG) or PDF for front ID"
        );
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFrontIdFile(file);
      setError("");

      // Create preview only for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFrontIdPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDF, set preview to null (we'll show file icon instead)
        setFrontIdPreview(null);
      }
    }
  };

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (images or PDF)
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      if (!isValidType) {
        setError(
          "Please upload an image file (PNG, JPG, JPEG) or PDF for back ID"
        );
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setBackIdFile(file);
      setError("");

      // Create preview only for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBackIdPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDF, set preview to null (we'll show file icon instead)
        setBackIdPreview(null);
      }
    }
  };

  const removeFrontId = () => {
    setFrontIdFile(null);
    setFrontIdPreview(null);
    if (frontIdInputRef.current) {
      frontIdInputRef.current.value = "";
    }
  };

  const removeBackId = () => {
    setBackIdFile(null);
    setBackIdPreview(null);
    if (backIdInputRef.current) {
      backIdInputRef.current.value = "";
    }
  };

  const isFormValid = () => {
    return frontIdFile !== null && backIdFile !== null;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please upload both front and back ID documents");
      return;
    }

    if (!frontIdFile || !backIdFile) {
      setError("Please upload both documents");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("front", frontIdFile);
      formData.append("back", backIdFile);

      const response = await axios.post(
        getApiUrl(
          API_CONFIG.ENDPOINTS.PARTICIPANTS.UPLOAD_DOCUMENT(participantId)
        ),
        formData,
        {
          headers: getAuthHeadersForFormData(),
        }
      );

      if (response.data && response.data.status === "success") {
        toast({
          title: "Documents uploaded successfully!",
          description: "Your ID documents have been uploaded successfully.",
        });

        // Reset form
        setFrontIdFile(null);
        setBackIdFile(null);
        setFrontIdPreview(null);
        setBackIdPreview(null);
        if (frontIdInputRef.current) frontIdInputRef.current.value = "";
        if (backIdInputRef.current) backIdInputRef.current.value = "";

        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        throw new Error(response.data?.message || "Failed to upload documents");
      }
    } catch (err: any) {
      console.error("Error uploading documents:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload documents. Please try again.";
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Upload ID Documents
          </CardTitle>
          <CardDescription>
            Please upload both front and back of your ID document (Images or
            PDF)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Participant Name - Autofilled */}
          <div className="space-y-2">
            <Label
              htmlFor="participantName"
              className="text-base font-semibold"
            >
              Participant Name
            </Label>
            <Input
              id="participantName"
              type="text"
              value={isLoadingParticipant ? "Loading..." : participantName}
              readOnly
              disabled={isLoadingParticipant}
              className="bg-gray-50 cursor-not-allowed"
              placeholder="Participant name will appear here"
            />
          </div>

          {/* Front ID Upload */}
          <div className="space-y-4">
            <Label htmlFor="frontId" className="text-base font-semibold">
              Front ID Document <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
              {frontIdFile ? (
                <div className="space-y-4">
                  <div className="relative">
                    {frontIdPreview ? (
                      <img
                        src={frontIdPreview}
                        alt="Front ID Preview"
                        className="w-full h-64 object-contain rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border">
                        <div className="text-center">
                          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 font-medium">
                            PDF Document
                          </p>
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeFrontId}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{frontIdFile?.name}</p>
                    <p>{(frontIdFile?.size || 0) / 1024 / 1024} MB</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="flex flex-col items-center gap-2">
                    <Input
                      id="frontId"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFrontIdChange}
                      ref={frontIdInputRef}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => frontIdInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Front ID
                    </Button>
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG, or PDF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back ID Upload */}
          <div className="space-y-4">
            <Label htmlFor="backId" className="text-base font-semibold">
              Back ID Document <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
              {backIdFile ? (
                <div className="space-y-4">
                  <div className="relative">
                    {backIdPreview ? (
                      <img
                        src={backIdPreview}
                        alt="Back ID Preview"
                        className="w-full h-64 object-contain rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border">
                        <div className="text-center">
                          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 font-medium">
                            PDF Document
                          </p>
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeBackId}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{backIdFile?.name}</p>
                    <p>{(backIdFile?.size || 0) / 1024 / 1024} MB</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="flex flex-col items-center gap-2">
                    <Input
                      id="backId"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleBackIdChange}
                      ref={backIdInputRef}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => backIdInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Back ID
                    </Button>
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG, or PDF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Status */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            {isFormValid() ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Both documents uploaded. Ready to submit.
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-600">
                  Please upload both front and back ID documents to proceed.
                </span>
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFrontIdFile(null);
                setBackIdFile(null);
                setFrontIdPreview(null);
                setBackIdPreview(null);
                setError("");
                if (frontIdInputRef.current) frontIdInputRef.current.value = "";
                if (backIdInputRef.current) backIdInputRef.current.value = "";
              }}
              disabled={isUploading}
            >
              Clear All
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid() || isUploading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Documents
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
