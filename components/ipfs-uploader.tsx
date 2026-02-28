"use client"

import { useState } from 'react';
import { ipfsService, IpfsUploadResult } from '@/lib/ipfs-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, Link, CheckCircle } from 'lucide-react';

export function IpfsUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<IpfsUploadResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev >= 95 ? 95 : prev + 5));
    }, 200);

    try {
      const result = await ipfsService.upload(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      toast({
        title: 'File Uploaded to IPFS',
        description: `CID: ${result.cid.substring(0, 20)}...`,
      });
    } catch (error) {
      console.error('IPFS upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'Could not upload file to IPFS.',
        variant: 'destructive',
      });
      clearInterval(progressInterval);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IPFS File Storage</CardTitle>
        <CardDescription>Upload and store project documents on the InterPlanetary File System.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 border-2 border-dashed rounded-lg text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Select a file to upload</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Any file up to 50MB</p>
            <div className="mt-6">
                <Input id="ipfs-file" type="file" onChange={handleFileChange} className="sr-only" />
                <label htmlFor="ipfs-file" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                    Choose File
                </label>
            </div>
        </div>

        {selectedFile && !isUploading && !uploadResult && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
                <File className="h-5 w-5" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Uploading {selectedFile?.name}...</p>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadResult && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800 dark:text-green-300">Upload Complete</h4>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <p className="font-mono bg-green-100 dark:bg-green-800/30 px-2 py-1 rounded-md text-xs">{uploadResult.cid}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    <a href={uploadResult.url} target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-400 hover:underline">
                        View on IPFS Gateway
                    </a>
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
