# Artifacts-cleaner
Adds tags to S3 objects, if order to get them collected by S3 event cycle.
S3 Path must follow this convention : 
`s3://BUCKET/PREFIX/module/hash/Binary/file.SUFFIX`.


## Environment variables
 - `BINARY_MARKER` : suffix used to identify binary files and distinguish them from the resto of the packages e.g. `.tar.gz`
 - `BUCKET` : S3 Bucket to work on
 - `PREFIX` : If set, will be added in front of S3 paths.