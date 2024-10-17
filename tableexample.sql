CREATE TABLE recipe_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    file_type ENUM('image', 'instruction', 'other'),
    bucket_name VARCHAR(255),
    file_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);
