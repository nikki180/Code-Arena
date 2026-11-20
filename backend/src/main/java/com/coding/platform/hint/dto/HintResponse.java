package com.coding.platform.hint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HintResponse {

    private Long id;

    private Long problemId;

    private Integer hintNumber;

    private String hintText;
}