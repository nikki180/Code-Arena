package com.coding.platform.hint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditorialResponse {

    private Long id;

    private Long problemId;

    private String editorialText;
}